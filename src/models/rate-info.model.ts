import {CryptoTicker} from './crypto-ticker.model';
import {RubTicker} from './rub-ticker.model';

export interface RateInfo {
  rub: RubTicker;
  crypto: CryptoTicker[];
}
