import {TFunction} from 'i18next';
import {Telegraf, Context} from 'telegraf';
import {Config} from '../../models/config.model';
import {BaseService} from '../common.service';
import {LoggerService} from '../logger/logger.service';

export class HelpCommandService extends BaseService {
  protected name = 'HelpCommandService';

  constructor(
    //
    protected logger: LoggerService,
    protected t: TFunction,
    protected config: Config,
    protected bot: Telegraf,
  ) {
    super(logger);
    this.bot.command('help', this.onHelp.bind(this));
  }

  async start(): Promise<void> {
    //
  }

  async stop(): Promise<void> {
    //
  }

  protected async onHelp(ctx: Context) {
    this.log(`called in chat: ${(ctx.chat as any)?.title || (ctx.chat as any)?.username} (${ctx.chat?.id})`);

    await ctx.replyWithHTML(this.t('HelpCommandService.helpMsg', {link: 'https://google.com'}));
  }
}
