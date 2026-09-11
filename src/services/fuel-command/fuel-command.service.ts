import {TFunction} from 'i18next';
import {FetchError} from 'node-fetch';
import {Telegraf, Context} from 'telegraf';
import {clearInterval} from 'timers';
import {autoInjectable, inject} from 'tsyringe';
import {ConfigToken, FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {AppError} from '../../models/app-error.model';
import {Config} from '../../models/config.model';
import {ContextWithMatch} from '../../models/context-with-match.model';
import {Fetch} from '../../models/fetch.model';
import {FuelStation} from '../../models/fuel-station.model';
import {BaseCommandService} from '../base-command.service';
import {LoggerService} from '../logger/logger.service';
import {excludedStationOsmIds} from './excluded-stations';

@autoInjectable()
export class FuelCommandService extends BaseCommandService {
  protected name = 'FuelCommandService';
  protected defaultFuels = ['95', '98', '100'];
  protected stations?: Promise<FuelStation[]>;
  protected stationsFetchedAt = 0;
  protected checkInterval = 5 * 60 * 1000;
  protected stationsWithFuelIds?: Set<string>;
  protected checkTimer!: NodeJS.Timer;

  constructor(
    protected logger: LoggerService,
    @inject(TFunctionToken) protected t: TFunction,
    protected bot: Telegraf,
    @inject(FetchToken) protected fetch: Fetch,
    @inject(ConfigToken) protected config: Config,
  ) {
    super(logger, bot);
    this.log('fuelUpdatesChats', this.config.fuelUpdatesChats);

    this.listenForCommand(['fuel', 'бензин'], this.onFuelCommand.bind(this));
  }

  async start(): Promise<void> {
    this.checkForNewStations().then();

    this.checkTimer = setInterval(() => {
      this.checkForNewStations().then();
    }, this.checkInterval);
  }

  async stop(): Promise<void> {
    clearInterval(this.checkTimer);
  }

  /**
   * Refreshes the stations cache and, once a baseline is known, notifies configured chats about every
   * station that now has one of the `defaultFuels` grades but didn't have it on the previous check.
   *
   * Note the diff is on which stations *have fuel*, not on which stations exist: the remote always
   * returns every station within the bounding box, only their `fuels_now` changes over time.
   */
  async checkForNewStations(): Promise<void> {
    try {
      const stations = await this.getStations(false);
      const stationsWithFuel = this.filterByFuels(stations, this.defaultFuels);
      const currentIds = new Set(stationsWithFuel.map(s => s.osmId));

      this.log(`Checked ${stations.length} stations, ${stationsWithFuel.length} of them with fuel`);

      const knownIds = this.stationsWithFuelIds;
      if (knownIds) {
        const newStations = stationsWithFuel.filter(s => !knownIds.has(s.osmId));

        if (newStations.length) {
          await this.notifyNewStationsWithFuel(newStations);
        }
      }

      this.stationsWithFuelIds = currentIds;
    } catch (e) {
      // getStations() already logs the failure; nothing else to do here
    }
  }

  async tellStations(ctx: Context, fuels: string[]): Promise<void> {
    try {
      const stations = await this.getStations();
      const matches = this.filterByFuels(stations, fuels);

      if (!matches.length) {
        await ctx.replyWithHTML(this.t(`${this.name}.noStationsFound`));
        return;
      }

      let response = this.t(`${this.name}.resultIntro`);
      matches.forEach(station => {
        response += this.formatStationRow(station) + '\n';
      });

      await ctx.replyWithHTML(response.trim());
    } catch (e) {
      await ctx.replyWithHTML(this.t('common.executionError'));
    }
  }

  async notifyNewStationsWithFuel(stations: FuelStation[]): Promise<void> {
    this.log('Notifying about new stations...' + JSON.stringify(stations));
    let message = this.t(`${this.name}.newStationsIntro`);
    stations.forEach(station => {
      message += this.formatStationRow(station) + '\n';
    });
    message = message.trim();

    this.log('fuelUpdatesChats', this.config.fuelUpdatesChats, 'message', message);
    await Promise.all(
      this.config.fuelUpdatesChats.map(chatId =>
        this.bot.telegram.sendMessage(chatId, message, {parse_mode: 'HTML'}).catch(e => {
          this.log(`Failed to notify chat ${chatId} about new stations: ` + (e as Error).message);
        }),
      ),
    );
  }

  protected filterByFuels(stations: FuelStation[], fuels: string[]): FuelStation[] {
    const wanted = fuels.map(f => f.toLocaleLowerCase());

    return stations.filter(s => s.fuels.some(f => wanted.includes(f.toLocaleLowerCase())));
  }

  protected formatStationRow(station: FuelStation): string {
    const name = station.name || station.brand || this.t(`${this.name}.unknownStation`);
    const key = station.addr ? 'stationInfo' : 'stationInfoNoAddr';
    const detail = station.detail || station.fuels || this.t(`${this.name}.noFuelInfo`);

    return this.t(`${this.name}.${key}`, {name, addr: station.addr, detail});
  }

  getStations(useCache = true): Promise<FuelStation[]> {
    if (useCache && this.stations && Date.now() - this.stationsFetchedAt < this.checkInterval) {
      return this.stations;
    }

    this.stationsFetchedAt = Date.now();
    this.stations = new Promise(async (resolve, reject) => {
      try {
        this.log('Getting fuel stations info from gdebenz.ru...');

        const url = `https://gdebenz.ru/api/nearby?lat=58.15&lon=52.65&radius_km=20&_=${Date.now()}`;
        const data: any = await this.fetch(url, {
          timeout: 30000,
          headers: {
            'sec-ch-ua-platform': '"macOS"',
            referer: 'https://gdebenz.ru/',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"',
            'sec-ch-ua-mobile': '?0',
          },
        }).then(r => r.json());

        if (!data || !Array.isArray(data.stations)) {
          throw new AppError('GDEBENZ_FETCH_FAILURE', 'Failed to fetch gdebenz.ru stations list');
        }

        const result: FuelStation[] = data.stations
          .filter((s: any) => !excludedStationOsmIds.includes(s.osm_id))
          .map(
            (s: any): FuelStation => ({
              osmId: s.osm_id,
              name: s.name || '',
              brand: s.brand || '',
              addr: s.addr || '',
              fuels: String(s.fuels_now || '')
                .split(',')
                .map(f => f.trim())
                .filter(Boolean),
              detail: s.detail || '',
            }),
          );

        this.log('Success');
        resolve(result);
      } catch (e) {
        this.log(`Error: status ${(e as FetchError).code}. ` + (e as FetchError).message);

        this.stations = undefined;
        reject(e);
      }
    });

    return this.stations;
  }

  protected async onFuelCommand(ctx: ContextWithMatch) {
    const params = ctx.match?.groups?.params;
    const fuels = params ? params.split(/[\s,]+/).filter(Boolean) : this.defaultFuels;

    await this.tellStations(ctx, fuels);
  }
}
