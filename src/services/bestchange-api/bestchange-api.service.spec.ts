import * as fs from 'fs';
import {Response} from 'node-fetch';
import {container} from 'tsyringe';
import {FetchToken} from '../../misc/injection-tokens';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {BestchangeApiService} from './bestchange-api.service';

const ethRubFetchResult = fs.readFileSync('src/services/bestchange-api/spec-eth-rub.html');

describe('BestchangeApiService', () => {
  let service: BestchangeApiService;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(LoggerService, new LoggerServiceMock());

    container.registerInstance(FetchToken, ((url: string) => {
      if (url.match(/bestchange/)) {
        return Promise.resolve(new Response(ethRubFetchResult));
      }
    }) as any);

    service = container.resolve(BestchangeApiService);
  });

  it('should return result from getRates', async () => {
    const result = await service.getRates(139, 105);

    expect(result.length).toBe(5);
    expect(result[0].title).toBe('Delets');
    expect(result[0].fromCurrency).toBe('ETH');
    expect(result[0].toCurrency).toBe('RUB');
    expect(result[0].price).toBe('69143');
    expect(result[0].isFavorite).toBe(false);

    expect(result[4].title).toBe('QuickChange');
    expect(result[4].isFavorite).toBe(true);
  });
});
