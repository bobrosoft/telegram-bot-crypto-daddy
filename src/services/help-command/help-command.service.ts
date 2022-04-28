import {TFunction} from 'i18next';
import {Telegraf, Context} from 'telegraf';
import {autoInjectable, inject} from 'tsyringe';
import {Config} from '../../models/config.model';
import {BaseService} from '../common.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class HelpCommandService extends BaseService {
  protected name = 'HelpCommandService';

  constructor(
    protected logger: LoggerService,
    @inject('TFunction') protected t: TFunction,
    @inject('Config') protected config: Config,
    protected bot: Telegraf,
  ) {
    super(logger);
    this.bot.command('help', this.onHelp.bind(this));
  }

  async start(): Promise<void> {
    // noop
  }

  async stop(): Promise<void> {
    // noop
  }

  protected async onHelp(ctx: Context) {
    this.log(`called in chat: ${(ctx.chat as any)?.title || (ctx.chat as any)?.username} (${ctx.chat?.id})`);

    await ctx.replyWithHTML(this.t('HelpCommandService.helpMsg', {link: 'https://google.com'}));
  }
}
