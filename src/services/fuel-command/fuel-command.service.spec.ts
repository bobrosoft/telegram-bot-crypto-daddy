import fs from 'fs';
import {Response} from 'node-fetch';
import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {FuelCommandService} from './fuel-command.service';

const stationsResult = fs.readFileSync(`${__dirname}/spec-stations.json`);

describe('FuelCommandService', () => {
  let ctxMock: TelegrafContextMock;
  let telegrafMock: TelegrafMock;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(TFunctionToken, ((key: string, options?: any) => {
      switch (key) {
        case 'FuelCommandService.resultIntro':
          return 'intro';

        case 'FuelCommandService.stationInfo':
        case 'FuelCommandService.stationInfoNoAddr':
          return options?.name;

        case 'FuelCommandService.unknownStation':
          return 'unknownStation';

        case 'FuelCommandService.noStationsFound':
          return 'noStationsFound';

        case 'common.executionError':
          return 'common.executionError';

        default:
          return '';
      }
    }) as any);

    container.registerInstance(LoggerService, new LoggerServiceMock());

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);

    fetchMock = jest.fn(() => Promise.resolve(new Response(stationsResult)));
    container.registerInstance(FetchToken, fetchMock as any);
  });

  it('should answer on /fuel with stations having default fuel grades (95/98/100) in stock', async () => {
    container.resolve(FuelCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/fuel');

    expect(ctxMock.replyWithHTML).toBeCalledWith('introБашнефть');
  });

  it('should answer on /fuel дт with stations having ДТ in stock', async () => {
    container.resolve(FuelCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/fuel дт');

    expect(ctxMock.replyWithHTML).toBeCalledWith('introЛукойл\nЛукойл\nЛукойл\nБашнефть');
  });

  it('should answer on /fuel 92,95 with stations matching either grade', async () => {
    container.resolve(FuelCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/fuel 92,95');

    expect(ctxMock.replyWithHTML).toBeCalledWith('introБашнефть');
  });

  it('should tell there are no stations found when nothing matches', async () => {
    container.resolve(FuelCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/fuel 98');

    expect(ctxMock.replyWithHTML).toBeCalledWith('noStationsFound');
  });

  it('should tell about an execution error when the fetch fails', async () => {
    container.registerInstance(FetchToken, (() => Promise.reject(new Error('boom'))) as any);
    container.resolve(FuelCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/fuel');

    expect(ctxMock.replyWithHTML).toBeCalledWith('common.executionError');
  });

  it('should cache stations between subsequent commands', async () => {
    const service = container.resolve(FuelCommandService);

    await telegrafMock.triggerHears('/fuel');
    await telegrafMock.triggerHears('/fuel дт');

    expect(fetchMock).toBeCalledTimes(1);
    expect(service).toBeTruthy();
  });
});
