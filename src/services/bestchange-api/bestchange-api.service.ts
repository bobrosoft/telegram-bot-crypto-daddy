import {autoInjectable, inject} from 'tsyringe';
import {FetchToken} from '../../misc/injection-tokens';
import {Exchange} from '../../models/exchange.model';
import {Fetch} from '../../models/fetch.model';
import {BaseService} from '../base.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class BestchangeApiService extends BaseService {
  protected name = 'BestchangeApiService';

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
  async getRates(from: number, to: number): Promise<Exchange[]> {
    const content = await this.fetch(`https://www.bestchange.ru/api.php?action=getrates&from=${from}&to=${to}`).then(
      r => r.text(),
    );

    const regex =
      'site_hr.*?<a.*?>(?<title>.*?)<.*?rate.*?>.*?>(?<fromCurrency>.*?)<.*?rate.*?>(?<price>.*?)<.*?>(?<toCurrency>.*?)[\\s<]';
    const match = content.matchAll(new RegExp(regex, 'gms'));

    return Array.from(match, (m: any): Exchange => {
      const title = m.groups?.title.trim() || '';
      let price = m.groups?.price.replace(/\s/g, '') || '';

      if (Number(price) > 10000) {
        price = price.replace(/\.\d+/, '') || '';
      }

      return {
        ...m.groups,
        title,
        price,
        isFavorite: ['QuickChange', 'ExHub', 'NetEx24'].includes(title),
      };
    });
  }
}
