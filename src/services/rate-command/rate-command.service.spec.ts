import * as fs from 'fs';
import {Response} from 'node-fetch';
import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {Exchange} from '../../models/exchange.model';
import {BestchangeApiService} from '../bestchange-api/bestchange-api.service';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {RateCommandService} from './rate-command.service';

const usdRubTomResult = fs.readFileSync('src/services/rate-command/USD000000TOD.json');
const aliFetchResult = fs.readFileSync('src/services/rate-command/spec-ali.html');
const cryptoFetchResult = fs.readFileSync('src/services/rate-command/spec-coingecko.json');

describe('RateCommandService', () => {
  let ctxMock: TelegrafContextMock;
  let telegrafMock: TelegrafMock;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(TFunctionToken, (key, options?: any) => {
      switch (key) {
        case 'RateCommandService.rateInfo':
          return `${options?.rub.official} ${options?.rub.aliexpress} ${options?.rub.bestchange}`;

        case 'RateCommandService.rateInfoRow':
          return ` ${options?.ticker.price}`;

        case 'common.executionError':
          return 'common.executionError';

        default:
          return '';
      }
    });

    container.registerInstance(LoggerService, new LoggerServiceMock());

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);

    container.registerInstance(FetchToken, ((url: string) => {
      if (url.match(/helpix/)) {
        return Promise.resolve(new Response(aliFetchResult));
      } else if (url.match(/coingecko/)) {
        return Promise.resolve(new Response(cryptoFetchResult));
      } else if (url.match(/moex/)) {
        return Promise.resolve(new Response(usdRubTomResult));
      }
    }) as any);

    container.registerInstance(BestchangeApiService, {
      getRates: () =>
        Promise.resolve<Exchange[]>([
          {
            title: 'Dabomax',
            price: '77.76',
            fromCurrency: 'USDT',
            toCurrency: 'RUB',
            isFavorite: false,
          },
          {
            title: 'QuickChange',
            price: '76.32',
            fromCurrency: 'USDT',
            toCurrency: 'RUB',
            isFavorite: true,
          },
        ]),
    } as any);
  });

  it('should answer on /rate command with rate info', async () => {
    container.resolve(RateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/rate');

    expect(ctxMock.replyWithHTML).toBeCalledWith('54.43 70.20 74.32 30473.00 2078.64 21.55 2.41', {
      disable_web_page_preview: true,
    });
  });

  it('should answer on /rate command with error message if fetch failed', async () => {
    container.registerInstance(FetchToken, (() => {
      return Promise.reject('failed to fetch');
    }) as any);

    container.resolve(RateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/rate');

    expect(ctxMock.replyWithHTML).toBeCalledWith('common.executionError');
  });
});
