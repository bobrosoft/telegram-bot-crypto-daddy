import * as fs from 'fs';
import {Response} from 'node-fetch';
import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {RateCommandService} from './rate-command.service';

const tinfoffUsdFetchResult = fs.readFileSync('src/services/rate-command/spec-tinkoff-usdt.html');
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
          return `${options?.rub.official} ${options?.rub.aliexpress} ${options?.rub.bestchange} ${options?.btc.price} ${options?.eth.price} ${options?.etc.price} ${options?.erg.price}`;

        default:
          return '';
      }
    });

    container.registerInstance(LoggerService, new LoggerServiceMock());

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);

    container.registerInstance(FetchToken, ((url: string) => {
      if (url.match(/bestchange/)) {
        return Promise.resolve(new Response(tinfoffUsdFetchResult));
      } else if (url.match(/helpix/)) {
        return Promise.resolve(new Response(aliFetchResult));
      } else if (url.match(/coingecko/)) {
        return Promise.resolve(new Response(cryptoFetchResult));
      }
    }) as any);
  });

  it('should answer on /rate command with rate info', async () => {
    container.resolve(RateCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/rate');

    expect(ctxMock.replyWithHTML).toBeCalledWith('64.55 70.20 75.77 30473.00 2078.64 21.55 2.41', {
      disable_web_page_preview: true,
    });
  });
});
