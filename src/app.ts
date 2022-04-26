import i18next, {TFunction} from 'i18next';
import {Telegraf} from 'telegraf';
import {translationsRU} from './i18n/ru';
import {Config} from './models/config.model';
import {HelpCommandService} from './services/help-command/help-command.service';
import {LoggerService} from './services/logger/logger.service';
import {BaseService} from './services/common.service';
import {provideConfig} from './services/config/config.provider';

export class App {
  protected t: TFunction; // i18n translation function
  protected bot: Telegraf;
  protected services: BaseService[] = [];
  protected logger: LoggerService;

  constructor(
    //
    protected config: Config = provideConfig(process.env.ENVIRONMENT as any),
  ) {
    // Init i18n
    i18next.init({lng: 'ru', returnObjects: true}).then();
    i18next.addResourceBundle('ru', 'translation', translationsRU, true, true);
    this.t = i18next.t;

    // Create bot
    this.bot = new Telegraf(config.botToken);

    // Create logger
    this.logger = new LoggerService();

    // Register all services
    this.services.push(new HelpCommandService(this.logger, this.t, this.config, this.bot));
  }

  async start(): Promise<void> {
    await this.bot.launch();
    await Promise.all(this.services.map(s => s.start()));

    this.logger.log('App', `Starting bot @${this.bot.botInfo?.username}`);
  }

  async stop(reason?: string) {
    this.bot.stop(reason);
    await Promise.all(this.services.map(s => s.stop()));

    this.logger.log('App', `Stopping bot @${this.bot.botInfo?.username}`);
  }
}
