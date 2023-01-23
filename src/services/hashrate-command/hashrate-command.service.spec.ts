import fs from 'fs';
import {Response} from 'node-fetch';
import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {JokeCommandService} from '../joke-command/joke-command.service';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {HashrateCommandService} from './hashrate-command.service';

const etcResult = fs.readFileSync(`${__dirname}/spec-etc.html`);

describe('HashrateCommandService', () => {
  let ctxMock: TelegrafContextMock;
  let telegrafMock: TelegrafMock;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(TFunctionToken, (key, options?: any) => {
      switch (key) {
        case 'HashrateCommandService.help':
          return 'help';

        case 'HashrateCommandService.gpuInfo':
          return options?.title;

        case 'HashrateCommandService.gpuNotFound':
          return 'gpuNotFound';

        default:
          return '';
      }
    });

    container.registerInstance(LoggerService, new LoggerServiceMock());

    container.registerInstance(JokeCommandService, {tellJoke: () => Promise.resolve()} as any);

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);

    container.registerInstance(FetchToken, (() => Promise.resolve(new Response(etcResult))) as any);
  });

  it('should answer on /hashrate command with help text', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate');

    expect(ctxMock.replyWithHTML).toBeCalledWith('help');
  });

  it('should answer on /hashrate 3070ti command with miners info about GPU', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 3070ti');

    expect(ctxMock.replyWithHTML).toBeCalledWith('NVIDIA RTX 3070 Ti');
  });

  it('should answer on /hashrate 3060ti command with miners info about 2 GPUs', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 3060ti');

    expect(ctxMock.replyWithHTML).toBeCalledWith('NVIDIA RTX 3060 Ti LHRNVIDIA RTX 3060 Ti');
  });

  it('should understand /hashrate 3070 ti variation of the command', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 3070 ti');

    expect(ctxMock.replyWithHTML).toBeCalledWith('NVIDIA RTX 3070 Ti');
  });

  it('should answer on /hashrate 666 command with "not found"', async () => {
    container.resolve(HashrateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/hashrate 666');

    expect(ctxMock.replyWithHTML).toBeCalledWith('gpuNotFound');
  });
});
