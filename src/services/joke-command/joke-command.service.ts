import {TFunction} from 'i18next';
import {Telegraf, Context} from 'telegraf';
import {autoInjectable, inject} from 'tsyringe';
import {TFunctionToken} from '../../misc/injection-tokens';
import {BaseCommandService} from '../base-command.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class JokeCommandService extends BaseCommandService {
  protected name = 'JokeCommandService';

  constructor(
    protected logger: LoggerService,
    @inject(TFunctionToken) protected t: TFunction,
    protected bot: Telegraf,
  ) {
    super(logger, bot);

    this.listenForCommand(['joke', 'шутка'], this.onJokeCommand.bind(this));
  }

  async start(): Promise<void> {
    // noop
  }

  async stop(): Promise<void> {
    // noop
  }

  async tellJoke(ctx: Context): Promise<void> {
    const jokes: string[] = this.t(`${this.name}.jokes`);
    const joke: string = jokes[Math.floor(Math.random() * jokes.length)];

    await ctx.replyWithHTML(joke);
  }

  protected async onJokeCommand(ctx: Context) {
    await this.tellJoke(ctx);
  }
}
