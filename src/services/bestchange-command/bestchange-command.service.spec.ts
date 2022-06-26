import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {Exchange} from '../../models/exchange.model';
import {KursExpertApiService} from '../kurs-expert-api/kurs-expert-api.service';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {BestchangeCommandService} from './bestchange-command.service';

describe('BestchangeCommandService', () => {
  let ctxMock: TelegrafContextMock;
  let telegrafMock: TelegrafMock;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(TFunctionToken, (key, options?: any) => {
      switch (key) {
        case 'BestchangeCommandService.rateInfoRow':
          return `${options?.title} ${options?.price}`;

        default:
          return '';
      }
    });

    container.registerInstance(LoggerService, new LoggerServiceMock());

    ctxMock = new TelegrafContextMock();
    telegrafMock = new TelegrafMock(ctxMock);
    container.registerInstance(Telegraf, telegrafMock as any);

    container.registerInstance(KursExpertApiService, {
      getRates: () =>
        Promise.resolve<Exchange[]>([
          {
            title: 'NetEx24',
            price: '135420',
            fromCurrency: 'ETH',
            toCurrency: 'RUB',
            isFavorite: true,
          },
          {
            title: 'QuickChange',
            price: '134921',
            fromCurrency: 'ETH',
            toCurrency: 'RUB',
            isFavorite: true,
          },
          {
            title: 'ExHub',
            price: '133863',
            fromCurrency: 'ETH',
            toCurrency: 'RUB',
            isFavorite: true,
          },
        ]),
    } as any);
  });

  it('should answer on /bestchange command with rate info', async () => {
    container.resolve(BestchangeCommandService);

    jest.spyOn(ctxMock, 'replyWithHTML');
    await telegrafMock.triggerHears('/bestchange');

    expect(ctxMock.replyWithHTML).toBeCalledWith('NetEx24 135420\nQuickChange 134921\nExHub 133863', {
      disable_web_page_preview: true,
    });
  });
});
