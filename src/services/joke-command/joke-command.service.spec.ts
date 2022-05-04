import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {JokeCommandService} from './joke-command.service';

describe('JokeCommandService', () => {
  let ctxMock: TelegrafContextMock;
  let telegrafMock: TelegrafMock;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(TFunctionToken, () => ['joke text', 'joke text', 'joke text']);

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);
  });

  it('should answer on /joke command', async () => {
    container.resolve(JokeCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/joke');

    expect(ctxMock.replyWithHTML).toBeCalledWith('joke text');
  });
});
