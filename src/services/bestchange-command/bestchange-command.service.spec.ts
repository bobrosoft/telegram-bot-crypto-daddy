import * as fs from 'fs';
import {Response} from 'node-fetch';
import {Telegraf} from 'telegraf';
import {container} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {TelegrafContextMock, TelegrafMock} from '../../misc/telegraf-mocks';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {BestchangeCommandService} from './bestchange-command.service';

const ethRubFetchResult = fs.readFileSync('src/services/bestchange-command/spec-eth-rub.html');

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

    container.registerInstance(FetchToken, ((url: string) => {
      if (url.match(/bestchange/)) {
        return Promise.resolve(new Response(ethRubFetchResult));
      }
    }) as any);
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
