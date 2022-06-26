import {autoInjectable, inject} from 'tsyringe';
import {FetchToken} from '../../misc/injection-tokens';
import {Utils} from '../../misc/utils';
import {Exchange} from '../../models/exchange.model';
import {Fetch} from '../../models/fetch.model';
import {BaseService} from '../base.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class KursExpertApiService extends BaseService {
  protected name = 'KursExpertApiService';
  protected lastCallTimestamp = 0;

  constructor(
    //
    protected logger: LoggerService,
    @inject(FetchToken) protected fetch: Fetch,
  ) {
    super(logger);
  }

  async start(): Promise<void> {
    // noop
  }

  async stop(): Promise<void> {
    // noop
  }

  /**
   * Returns list of exchanges with information exchange rates
   */
  async getRates(from: string, to: string): Promise<Exchange[]> {
    // Need to debounce subsequent API calls
    if (Date.now() - this.lastCallTimestamp < 10000) {
      await Utils.setTimeoutAsync(10000);
      return this.getRates(from, to);
    }

    this.lastCallTimestamp = Date.now();
    const body = new URLSearchParams({
      from,
      to,
      host: '',
      lang: 'en',
    });
    const responseData = await this.fetch(`https://kurs.expert/api/directionlist`, {
      method: 'POST',
      body: body,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36',
      },
    }).then(r => r.json());

    return Object.values(responseData.answer.exchangersList).map((item: any): Exchange => {
      let price = item.out;

      if (Number(price) > 10000) {
        price = price.replace(/\.\d+/, '') || '';
      }

      return {
        title: item.name,
        price,
        fromCurrency: item.fromUnit,
        toCurrency: item.toUnit,
        isFavorite: ['QuickChange', 'ExHub', 'NetEx24'].includes(item.name),
      };
    });
  }
}
