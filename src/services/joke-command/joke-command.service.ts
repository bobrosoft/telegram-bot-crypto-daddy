import {TFunction} from 'i18next';
import {Telegraf, Context} from 'telegraf';
import {Config} from '../../models/config.model';
import {BaseService} from '../common.service';
import {LoggerService} from '../logger/logger.service';

export class JokeCommandService extends BaseService {
  protected name = 'JokeCommandService';

  constructor(
    //
    protected logger: LoggerService,
    protected t: TFunction,
    protected config: Config,
    protected bot: Telegraf,
  ) {
    super(logger);

    this.bot.command('joke', this.onJoke.bind(this));
    this.bot.command('шутка', this.onJoke.bind(this));
  }

  async start(): Promise<void> {
    //
  }

  async stop(): Promise<void> {
    //
  }

  async tellJoke(ctx: Context): Promise<void> {
    const jokes: string[] = this.t(`${this.name}.jokes`);
    const joke: string = jokes[Math.floor(Math.random() * jokes.length)];

    await ctx.replyWithHTML(joke);
  }

  protected async onJoke(ctx: Context) {
    await this.tellJoke(ctx);
  }
}
