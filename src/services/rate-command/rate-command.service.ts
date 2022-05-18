import {TFunction} from 'i18next';
import {FetchError} from 'node-fetch';
import {Telegraf, Context} from 'telegraf';
import {clearInterval} from 'timers';
import {autoInjectable, inject} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {Utils} from '../../misc/utils';
import {ContextWithMatch} from '../../models/context-with-match.model';
import {Fetch} from '../../models/fetch.model';
import {RateInfo} from '../../models/rate-info.model';
import {BaseCommandService} from '../base-command.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class RateCommandService extends BaseCommandService {
  protected name = 'RateCommandService';
  protected rateInfo?: Promise<RateInfo>;
  protected rateInfoUpdateTimer!: NodeJS.Timer;

  constructor(
    protected logger: LoggerService,
    @inject(TFunctionToken) protected t: TFunction,
    protected bot: Telegraf,
    @inject(FetchToken) protected fetch: Fetch,
  ) {
    super(logger, bot);

    this.listenForCommand(['rate', 'rates', 'курс'], this.onRateCommand.bind(this));
  }

  async start(): Promise<void> {
    this.getRateInfo(false).then(); // no need for await here

    // Setup periodic info update
    this.rateInfoUpdateTimer = setInterval(() => {
      this.getRateInfo(false).then();
    }, 3 * 60 * 60 * 1000);
  }

  async stop(): Promise<void> {
    clearInterval(this.rateInfoUpdateTimer);
  }

  async tellRate(ctx: Context): Promise<void> {
    const rateInfo = await this.getRateInfo();

    const response = this.t(`${this.name}.rateInfo`, rateInfo);
    await ctx.replyWithHTML(response.trim(), {disable_web_page_preview: true, disable_notification: true});

    // await Utils.setTimeoutAsync(600);
    // await this.jokeCommandService.tellJoke(ctx);
  }

  getRateInfo(useCache = true): Promise<RateInfo> {
    if (useCache && this.rateInfo) {
      return this.rateInfo;
    }

    this.rateInfo = new Promise<RateInfo>(async (resolve, reject) => {
      try {
        let result: RateInfo = {
          rubOfficial: '???',
          rubAliexpress: '???',
          rubBestchange: '???',
          btcUsd: '???',
          ethUsd: '???',
          etcUsd: '???',
          ergUsd: '???',
        };

        this.log('Getting rate info from remotes: getBestchangeInfo...');
        result = {
          ...result,
          ...(await this.getBestchangeInfo()),
        };
        this.log('Success');

        this.log('Getting rate info from remotes: getAliInfo...');
        result = {
          ...result,
          ...(await this.getAliInfo()),
        };
        this.log('Success');

        this.log('Getting rate info from remotes: get2CryptocalcInfo...');
        result = {
          ...result,
          ...(await this.get2CryptocalcInfo()),
        };
        this.log('Success');

        resolve(result);
      } catch (e) {
        this.log(`Error: status ${(e as FetchError).code}. ` + (e as FetchError).message);

        this.rateInfo = undefined;
        reject(e);
      }
    });

    return this.rateInfo;
  }

  protected async getBestchangeInfo(): Promise<{rubBestchange: string; rubOfficial: string}> {
    let rubBestchange: string;
    let rubOfficial: string;

    const content = await this.fetch('https://www.bestchange.ru/action.php', {
      method: 'POST',
      body: 'action=getrates&page=rates&from=105&to=36&city=0&type=&give=&get=&commission=0&sort=from&range=asc&sortm=0&tsid=0',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    }).then(r => r.text());

    {
      const regex = `fs">(.*?)<`;
      const match = content.matchAll(new RegExp(regex, 'gm'));
      const rates = Array.from(match, m => (m[1] || '').trim());

      rubBestchange = Utils.normalizePrice(Number(rates[3]) - 2 || rates[0]);
    }

    {
      const regex = `helplink.*?bt">(.*?)<`;
      const match = content.match(new RegExp(regex, 's'));

      rubOfficial = Utils.normalizePrice(match?.[1]);
    }

    return {rubBestchange, rubOfficial};
  }

  protected async getAliInfo(): Promise<{rubAliexpress: string}> {
    let rubAliexpress: string;

    const content = await this.fetch('https://helpix.ru/currency/').then(r => r.text());

    {
      const regex = `b-tabcurr__td">(.*?)<`;
      const match = content.matchAll(new RegExp(regex, 'gm'));
      const rates = Array.from(match, m => (m[1] || '').trim());

      // Find last price listing
      let i = 2;
      while (rates[i] === '-') {
        i += 6;
      }

      rubAliexpress = Utils.normalizePrice(rates[i]?.toString());
    }

    return {rubAliexpress};
  }

  protected async get2CryptocalcInfo(): Promise<{ethUsd: string; btcUsd: string; etcUsd: string; ergUsd: string}> {
    let ethUsd: string;
    let btcUsd: string;
    let etcUsd: string;
    let ergUsd: string;

    const content = await this.fetch('https://2cryptocalc.com/').then(r => r.text());
    {
      const regex = `crypto-coin__abbr">(?<coin>.*?)<.*?Price.*?text-val">(?<price>.*?)<`;
      const match = content.matchAll(new RegExp(regex, 'gms'));
      const rates: {coin?: string; price?: string}[] = Array.from(match, m => ({
        coin: m.groups?.coin,
        price: m.groups?.price.replace(/\s/g, ''),
      }));

      ethUsd = rates.find(c => c.coin === 'ETH')?.price || '???';
      btcUsd = rates.find(c => c.coin === 'BTC')?.price || '???';
      etcUsd = rates.find(c => c.coin === 'ETC')?.price || '???';
      ergUsd = rates.find(c => c.coin === 'ERG')?.price || '???';
    }

    return {
      ethUsd: Utils.normalizePrice(ethUsd),
      btcUsd: Utils.normalizePrice(btcUsd),
      etcUsd: Utils.normalizePrice(etcUsd),
      ergUsd: Utils.normalizePrice(ergUsd),
    };
  }

  protected async onRateCommand(ctx: ContextWithMatch) {
    await this.tellRate(ctx);
  }
}
