import * as fs from 'fs';
import {Response} from 'node-fetch';
import {container} from 'tsyringe';
import {FetchToken} from '../../misc/injection-tokens';
import {LoggerService} from '../logger/logger.service';
import {LoggerServiceMock} from '../logger/logger.service.mock';
import {KursExpertApiService} from './kurs-expert-api.service';

const ethRubFetchResult = fs.readFileSync('src/services/kurs-expert-api/ethereum-tinkoff.json');

describe('KursExpertApiService', () => {
  let service: KursExpertApiService;

  beforeEach(() => {
    container.clearInstances();

    container.registerInstance(LoggerService, new LoggerServiceMock());

    container.registerInstance(FetchToken, ((url: string) => {
      if (url.match(/kurs.expert/)) {
        return Promise.resolve(new Response(ethRubFetchResult));
      }
    }) as any);

    service = container.resolve(KursExpertApiService);
  });

  it('should return result from getRates', async () => {
    const result = await service.getRates('ethereum', 'tinkoff');

    expect(result.length).toBe(5);
    expect(result[0].title).toBe('Урал-обмен');
    expect(result[0].fromCurrency).toBe('ETH');
    expect(result[0].toCurrency).toBe('RUB');
    expect(result[0].price).toBe('73791');
    expect(result[0].isFavorite).toBe(false);

    expect(result[1].title).toBe('QuickChange');
    expect(result[1].isFavorite).toBe(true);
  });
});
