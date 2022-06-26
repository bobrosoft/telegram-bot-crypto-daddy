import {TFunction} from 'i18next';
import {FetchError} from 'node-fetch';
import {Telegraf, Context} from 'telegraf';
import {clearInterval} from 'timers';
import {autoInjectable, inject} from 'tsyringe';
import {TFunctionToken} from '../../misc/injection-tokens';
import {BestchangeInfo} from '../../models/bestchange-info.model';
import {ContextWithMatch} from '../../models/context-with-match.model';
import {BaseCommandService} from '../base-command.service';
import {KursExpertApiService} from '../kurs-expert-api/kurs-expert-api.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class BestchangeCommandService extends BaseCommandService {
  protected name = 'BestchangeCommandService';
  protected rateInfo?: Promise<BestchangeInfo>;
  protected rateInfoUpdateTimer!: NodeJS.Timer;

  constructor(
    protected logger: LoggerService,
    @inject(TFunctionToken) protected t: TFunction,
    protected bot: Telegraf,
    protected kursExpertApiService: KursExpertApiService,
  ) {
    super(logger, bot);

    this.listenForCommand(['bestchange'], this.onBestchangeCommand.bind(this));
  }

  async start(): Promise<void> {
    this.getRateInfo(false).then(); // no need for await here

    // Setup periodic info update
    this.rateInfoUpdateTimer = setInterval(() => {
      this.getRateInfo(false).then();
    }, (2 * 60 * 60 + 10) * 1000);
  }

  async stop(): Promise<void> {
    clearInterval(this.rateInfoUpdateTimer);
  }

  async tellRate(ctx: Context): Promise<void> {
    try {
      const rateInfo = await this.getRateInfo();

      let response = this.t(`${this.name}.resultIntro`);
      response += '\n\n';
      response += this.t(`${this.name}.rateInfo`, rateInfo) + '\n';
      rateInfo.exchanges.forEach(exchange => {
        response += this.t(`${this.name}.rateInfoRow`, exchange) + '\n';
      });

      await ctx.replyWithHTML(response.trim(), {disable_web_page_preview: true});
    } catch (e) {
      await ctx.replyWithHTML(this.t('common.executionError'));
    }
  }

  getRateInfo(useCache = true): Promise<BestchangeInfo> {
    if (useCache && this.rateInfo) {
      return this.rateInfo;
    }

    this.rateInfo = new Promise<BestchangeInfo>(async (resolve, reject) => {
      try {
        const result: BestchangeInfo = {
          fromSymbol: 'ETH',
          toSymbol: 'RUB',
          exchanges: [],
          url: 'https://www.bestchange.ru/ethereum-to-tinkoff.html',
        };

        this.log('Getting rate info from Bestchange...');
        const exchanges = await this.kursExpertApiService.getRates('ethereum', 'tinkoff');

        result.exchanges = exchanges.map(e => ({title: e.title, price: e.price}));
        this.log('Success');

        resolve(result);
      } catch (e) {
        this.logFetchError(e as any);

        this.rateInfo = undefined;
        reject(e);
      }
    });

    return this.rateInfo;
  }

  protected logFetchError(e: FetchError) {
    this.log(`Error: status ${(e as FetchError).code}. ` + (e as FetchError).message);
  }

  protected async onBestchangeCommand(ctx: ContextWithMatch) {
    await this.tellRate(ctx);
  }
}
