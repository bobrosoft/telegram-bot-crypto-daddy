import {Context} from 'telegraf';

export class TelegrafContextMock {
  async replyWithHTML(html: string) {
    // noop
  }
}

export class TelegrafMock {
  protected commandListeners: Array<{command: string; callback: (ctx: Context) => Promise<void>}> = [];

  constructor(protected ctxMock: TelegrafContextMock) {}

  command(command: string, callback: (ctx: Context) => Promise<void>) {
    this.commandListeners.push({command, callback});
  }

  triggerCommand(command: string, params?: string): Promise<void[]> {
    return Promise.all(
      this.commandListeners
        //
        .filter(cl => cl.command === command)
        .map(cl => Promise.resolve(cl.callback(this.ctxMock as any))),
    );
  }
}
