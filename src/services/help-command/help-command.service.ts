import {TFunction} from 'i18next';
import {Telegraf, Context} from 'telegraf';
import {autoInjectable, inject} from 'tsyringe';
import {TFunctionToken} from '../../misc/injection-tokens';
import {BaseCommandService} from '../base-command.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class HelpCommandService extends BaseCommandService {
  protected name = 'HelpCommandService';

  constructor(
    protected logger: LoggerService,
    @inject(TFunctionToken) protected t: TFunction,
    protected bot: Telegraf,
  ) {
    super(logger, bot);

    bot.start(ctx => ctx.replyWithHTML(this.t(`${this.name}.introMsg`)));
    this.listenForCommand(['help', 'помощь', 'справка'], this.onHelp.bind(this));
  }

  async start(): Promise<void> {
    // noop
  }

  async stop(): Promise<void> {
    // noop
  }

  protected async onHelp(ctx: Context) {
    await ctx.replyWithHTML(this.t('HelpCommandService.helpMsg'));
  }
}
