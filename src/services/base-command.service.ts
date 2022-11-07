import {Telegraf} from 'telegraf';
import {ContextWithMatch} from '../models/context-with-match.model';
import {BaseService} from './base.service';
import {LoggerService} from './logger/logger.service';

export abstract class BaseCommandService extends BaseService {
  protected bot: Telegraf;

  protected constructor(logger: LoggerService, bot: Telegraf) {
    super(logger);

    this.bot = bot;
  }

  protected listenForCommand(variations: string[], callback: (ctx: ContextWithMatch) => Promise<void>) {
    this.bot.hears(
      new RegExp(`^\/(?<command>${variations.join('|')})(@[\\w\\-]*)?(\\s+(?<params>[^]*))?$`),
      async ctx => {
        this.log(
          `received command: "${ctx.message.text}" from: ${ctx.message.from.username}(ID: ${ctx.message.from.id}) on chat.id: ${ctx.chat.id}`,
        );
        await callback(ctx);
      },
    );
  }
}
