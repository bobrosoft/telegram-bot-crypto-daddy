import {Context} from 'telegraf';
import {ContextWithMatch} from '../models/context-with-match.model';

export class TelegrafContextMock {
  match?: {groups?: {command?: string; params?: string}};

  async replyWithHTML(html: string) {
    // noop
  }
}

export class TelegrafMock {
  protected commandListeners: Array<{command: string; callback: (ctx: Context) => Promise<void>}> = [];
  protected hearsListeners: Array<{matcher: RegExp; callback: (ctx: ContextWithMatch) => Promise<void>}> = [];

  constructor(protected ctxMock: TelegrafContextMock) {}

  command(command: string, callback: (ctx: Context) => Promise<void>) {
    this.commandListeners.push({command, callback});
  }

  hears(matcher: RegExp, callback: (ctx: ContextWithMatch) => Promise<void>) {
    this.hearsListeners.push({matcher, callback});
  }

  triggerCommand(command: string): Promise<void[]> {
    return Promise.all(
      this.commandListeners
        //
        .filter(cl => cl.command === command)
        .map(cl => Promise.resolve(cl.callback(this.ctxMock as any))),
    );
  }

  triggerHears(text: string): Promise<void[]> {
    return Promise.all(
      this.hearsListeners
        //
        .filter(cl => cl.matcher.test(text))
        .map(cl => {
          this.ctxMock.match = cl.matcher.exec(text) as any;
          return Promise.resolve(cl.callback(this.ctxMock as any));
        }),
    );
  }
}
