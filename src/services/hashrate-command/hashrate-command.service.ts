import {TFunction} from 'i18next';
import {FetchError} from 'node-fetch';
import {Telegraf, Context} from 'telegraf';
import {clearInterval} from 'timers';
import {autoInjectable, inject} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {Utils} from '../../misc/utils';
import {ContextWithMatch} from '../../models/context-with-match.model';
import {Fetch} from '../../models/fetch.model';
import {GpuInfoList} from '../../models/gpu-info-list.model';
import {BaseCommandService} from '../base-command.service';
import {JokeCommandService} from '../joke-command/joke-command.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class HashrateCommandService extends BaseCommandService {
  protected name = 'HashrateCommandService';
  protected gpuInfoList?: Promise<GpuInfoList>;
  protected gpuInfoUpdateTimer!: NodeJS.Timer;

  constructor(
    protected logger: LoggerService,
    @inject(TFunctionToken) protected t: TFunction,
    protected bot: Telegraf,
    @inject(FetchToken) protected fetch: Fetch,
    protected jokeCommandService: JokeCommandService,
  ) {
    super(logger, bot);

    this.listenForCommand(['hashrate', 'hash', 'хэш', 'хеш', 'хешрейт', 'хэшрейт'], this.onHashrateCommand.bind(this));
  }

  async start(): Promise<void> {
    this.getGpuInfoDatabase(false).then(); // no need for await here

    // Setup periodic info update
    this.gpuInfoUpdateTimer = setInterval(() => {
      this.getGpuInfoDatabase(false).then();
    }, 86400 * 1000);
  }

  async stop(): Promise<void> {
    clearInterval(this.gpuInfoUpdateTimer);
  }

  async tellHelp(ctx: Context): Promise<void> {
    await ctx.replyWithHTML(this.t(`${this.name}.help`));
  }

  async tellGpuInfo(ctx: Context, gpu: string): Promise<void> {
    const gpuInfoList = await this.getGpuInfoDatabase();
    const preparedGpu = gpu.toLocaleLowerCase().replace(/\s/g, '');

    const gpus = gpuInfoList.filter(gpu => gpu.searchStr.includes(preparedGpu));
    if (!gpus.length) {
      await ctx.replyWithHTML(this.t(`${this.name}.gpuNotFound`));
      return;
    }

    let response: string = this.t(`${this.name}.resultIntro`);
    gpus.forEach(gpu => {
      response += this.t(`${this.name}.gpuInfo`, gpu).trim();
      response += this.t(`${this.name}.gpuInfoSeparator`);
    });

    await ctx.replyWithHTML(response.trim());

    await Utils.setTimeoutAsync(600);
    await this.jokeCommandService.tellJoke(ctx);
  }

  getGpuInfoDatabase(useCache = true): Promise<GpuInfoList> {
    if (useCache && this.gpuInfoList) {
      return this.gpuInfoList;
    }

    this.gpuInfoList = new Promise(async (resolve, reject) => {
      try {
        this.log('Getting GPUs info from remote...');
        const content = await this.fetch('https://www.hashrate.no/ETH').then(r => r.text());

        // Pre-filter content
        const match1 = content.match(/w3-table(?<content>.*?)<\/table/m);

        // Parse content
        const regex =
          `td.*?gpulist.*?href.*?'(?<href>.*?)'` +
          `.*?\/>(?<title>.*?)<\/a>` +
          `.*?gpulist.*?gpulist.*?>(?<hashrate>.*?)<` +
          `.*?gpulist.*?>(?<power>.*?)<` +
          `.*?gpulist.*?gpulist.*?(?<profit>\\$.*?)<` +
          `.*?gpulist.*?>(?<roi>.*?)<`;
        const match2 = (match1?.groups?.content || '').matchAll(new RegExp(regex, 'gm'));

        const result: GpuInfoList = Array.from(match2, m => {
          return {
            ...m.groups,
            href: `https://www.hashrate.no${m.groups?.href}#:~:text=OVERCLOCKS`,
            searchStr: (m.groups?.title || '').toLocaleLowerCase().replace(/\s/g, ''),
          } as any;
        });

        this.log('Success');
        resolve(result);
      } catch (e) {
        this.log(`Error: status ${(e as FetchError).code}. ` + (e as FetchError).message);

        this.gpuInfoList = undefined;
        reject(e);
      }
    });

    return this.gpuInfoList;
  }

  protected async onHashrateCommand(ctx: ContextWithMatch) {
    const gpu = ctx.match?.groups?.params;

    if (gpu) {
      await this.tellGpuInfo(ctx, gpu);
    } else {
      await this.tellHelp(ctx);
    }
  }
}
