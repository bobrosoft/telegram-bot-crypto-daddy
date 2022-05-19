import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {HelpCommandService} from './help-command.service';

describe('JokeCommandService', () => {
  let ctxMock: TelegrafContextMock;
  let telegrafMock: TelegrafMock;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(TFunctionToken, (key, options?: any) => {
      switch (key) {
        case 'HelpCommandService.helpMsg':
          return 'helpMsg';

        default:
          return '';
      }
    });

    container.registerInstance(LoggerService, new LoggerServiceMock());

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);

    container.resolve(HelpCommandService);
  });

  it('should answer on /help command', async () => {
    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/help');

    expect(ctxMock.replyWithHTML).toBeCalledWith('helpMsg');
  });

  it('should answer on /help@CryptoDaddyyBot command', async () => {
    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/help@CryptoDaddyyBot');

    expect(ctxMock.replyWithHTML).toBeCalledWith('helpMsg');
  });
});
