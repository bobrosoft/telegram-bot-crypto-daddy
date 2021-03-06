import i18next from 'i18next';
import fetch from 'node-fetch';
import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {translationsRU} from './i18n/ru';
import {ConfigToken, FetchToken, TFunctionToken} from './misc/injection-tokens';
import {Config} from './models/config.model';
import {BestchangeCommandService} from './services/bestchange-command/bestchange-command.service';
import {HashrateCommandService} from './services/hashrate-command/hashrate-command.service';
import {HelpCommandService} from './services/help-command/help-command.service';
import {JokeCommandService} from './services/joke-command/joke-command.service';
import {KursExpertApiService} from './services/kurs-expert-api/kurs-expert-api.service';
import {LoggerService} from './services/logger/logger.service';
import {BaseService} from './services/base.service';
import {provideConfig} from './services/config/config.provider';
import {RateCommandService} from './services/rate-command/rate-command.service';

export class App {
  protected services: BaseService[] = [];

  protected get bot(): Telegraf {
    return container.resolve(Telegraf);
  }

  protected get logger(): LoggerService {
    return container.resolve(LoggerService);
  }

  constructor(
    //
    protected config: Config = provideConfig(process.env.ENVIRONMENT as any),
  ) {
    // Register config
    container.registerInstance(ConfigToken, config);

    // Init i18n
    i18next.init({lng: 'ru', returnObjects: true}).then();
    i18next.addResourceBundle('ru', 'translation', translationsRU, true, true);
    container.registerInstance(TFunctionToken, i18next.t);

    // Create bot
    container.registerInstance(Telegraf, new Telegraf(config.botToken));

    // Create logger
    container.registerSingleton(LoggerService);

    // Register fetch
    container.registerInstance(FetchToken, fetch);

    // Register all services
    container.registerSingleton(KursExpertApiService);
    this.services.push(container.resolve(KursExpertApiService));

    this.services.push(container.resolve(HelpCommandService));
    this.services.push(container.resolve(JokeCommandService));
    this.services.push(container.resolve(HashrateCommandService));
    this.services.push(container.resolve(RateCommandService));
    this.services.push(container.resolve(BestchangeCommandService));
  }

  async start(): Promise<void> {
    await this.bot.launch();
    this.logger.log('App', `Starting bot @${this.bot.botInfo?.username}`);

    await Promise.all(this.services.map(s => s.start()));
  }

  async stop(reason?: string) {
    this.bot.stop(reason);
    await Promise.all(this.services.map(s => s.stop()));

    this.logger.log('App', `Stopping bot @${this.bot.botInfo?.username}`);
  }
}
