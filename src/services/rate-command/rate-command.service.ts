import {TFunction} from 'i18next';
import {FetchError} from 'node-fetch';
import {Context, Telegraf} from 'telegraf';
import {clearInterval} from 'timers';
import {autoInjectable, inject} from 'tsyringe';
import {FetchToken, TFunctionToken} from '../../misc/injection-tokens';
import {Utils} from '../../misc/utils';
import {AppError} from '../../models/app-error.model';
import {ContextWithMatch} from '../../models/context-with-match.model';
import {CryptoTicker} from '../../models/crypto-ticker.model';
import {Fetch} from '../../models/fetch.model';
import {RateInfo} from '../../models/rate-info.model';
import {BaseCommandService} from '../base-command.service';
import {KursExpertApiService} from '../kurs-expert-api/kurs-expert-api.service';
import {LoggerService} from '../logger/logger.service';

@autoInjectable()
export class RateCommandService extends BaseCommandService {
  protected name = 'RateCommandService';
  protected rateInfo?: Promise<RateInfo>;
  protected rateInfoUpdateTimer!: NodeJS.Timer;

  constructor(
    protected logger: LoggerService,
    @inject(TFunctionToken) protected t: TFunction,
    protected bot: Telegraf,
    @inject(FetchToken) protected fetch: Fetch,
    protected kursExpertApiService: KursExpertApiService,
  ) {
    super(logger, bot);

    this.listenForCommand(['rate', 'rates', 'курс'], this.onRateCommand.bind(this));
  }

  async start(): Promise<void> {
    this.getRateInfo(false).then(); // no need for await here

    // Setup periodic info update
    this.rateInfoUpdateTimer = setInterval(() => {
      this.getRateInfo(false).then();
    }, 2 * 60 * 60 * 1000);
  }

  async stop(): Promise<void> {
    clearInterval(this.rateInfoUpdateTimer);
  }

  async tellRate(ctx: Context): Promise<void> {
    try {
      const rateInfo = await this.getRateInfo();

      let response = this.t(`${this.name}.rateInfo`, rateInfo);
      rateInfo.crypto.forEach(ticker => {
        response += this.t(`${this.name}.rateInfoRow`, {ticker});
      });
      await ctx.replyWithHTML(response.trim(), {disable_web_page_preview: true});
    } catch (e) {
      await ctx.replyWithHTML(this.t('common.executionError'));
    }
  }

  async getRateInfo(useCache = true): Promise<RateInfo> {
    if (useCache && this.rateInfo) {
      return this.rateInfo;
    }

    const prevRateInfo: RateInfo | null = this.rateInfo ? await this.rateInfo : null;

    this.rateInfo = new Promise<RateInfo>(async (resolve, reject) => {
      try {
        let failureCount = 0;
        let result: RateInfo = prevRateInfo
          ? Utils.clone(prevRateInfo) // let's use previous result for "failed to fetch" values
          : {
              rub: {
                official: '???',
                aliexpress: '???',
                bestchange: '???',
              },
              crypto: [],
            };

        this.log('Getting rate info from remotes: getUsdRubPrice...');
        try {
          result.rub.official = await this.getUsdRubPrice();

          this.log('Success (getUsdRubPrice)');
        } catch (e) {
          failureCount++;
          this.logFetchError(e as any);
        }

        this.log('Getting rate info from remotes: getUsdtRubPrice...');
        try {
          result.rub.bestchange = await this.getUsdtRubPrice();

          this.log('Success (getUsdtRubPrice)');
        } catch (e) {
          failureCount++;
          this.logFetchError(e as any);
        }

        this.log('Getting rate info from remotes: getAliInfo...');
        try {
          const info = await this.getAliInfo();
          result.rub.aliexpress = info.rubAliexpress;

          this.log('Success (getAliInfo)');
        } catch (e) {
          failureCount++;
          this.logFetchError(e as any);
        }

        this.log('Getting rate info from remotes: getCoinGeckoInfo...');
        try {
          result = {
            ...result,
            crypto: [...(await this.getCoinGeckoInfo())],
          };

          this.log('Success (getCoinGeckoInfo)');
        } catch (e) {
          failureCount++;
          this.logFetchError(e as any);
        }

        // Check for failures during fetch
        if (failureCount >= 2 && !prevRateInfo) {
          throw new AppError('TOO_MANY_FAILURES');
        }

        resolve(result);
      } catch (e) {
        this.log(e as any);
        reject(e);
      }
    });

    return this.rateInfo;
  }

  protected async getUsdtRubPrice(): Promise<string> {
    const exchanges = await this.kursExpertApiService.getRates('usdt.trc-20', 'tinkoff');
    return Utils.normalizePrice(Number(exchanges[1].price) + 2);
  }

  protected async getUsdRubPrice(): Promise<string> {
    // return this.getUsdRubPriceMoex();
    return this.getUsdRubPriceBankiros();
  }

  protected async getUsdRubPriceMoex(): Promise<string> {
    const usdRubRate = await this.fetch(
      'https://iss.moex.com/iss/engines/currency/markets/selt/boards/CETS/securities/USD000UTSTOM.json',
      {timeout: 30000},
    ).then(r => r.json());

    if (!usdRubRate.marketdata.data[0][8]) {
      throw new AppError('MOEX_FETCH_FAILURE', 'Failed to fetch USD000UTSTOM');
    }

    return Utils.normalizePrice(usdRubRate.marketdata.data[0][8]);
  }

  protected async getUsdRubPriceBankiros(): Promise<string> {
    const usdRubRate = await this.fetch('https://bankiros.ru/ajax/moex-tool?tool_id=1', {
      timeout: 30000,
      headers: {
        accept: '*/*',
        'accept-language': 'en,ru;q=0.9',
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        referrer: 'https://bankiros.ru/currency/moex/usdrub-tom',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36',
      },
    }).then(r => r.json());

    if (!usdRubRate.data?.last) {
      throw new AppError('MOEX_FETCH_FAILURE', 'Failed to fetch USD000UTSTOM');
    }

    return Utils.normalizePrice(usdRubRate.data?.last);
  }

  protected async getAliInfo(): Promise<{rubAliexpress: string}> {
    let rubAliexpress: string;

    const content = await this.fetch('https://helpix.ru/currency/').then(r => r.text());

    {
      const regex = `b-tabcurr__td">(.*?)<`;
      const match = content.matchAll(new RegExp(regex, 'gm'));
      const rates = Array.from(match, m => (m[1] || '').trim());

      // Find last price listing
      let i = 2;
      while (rates[i] === '-') {
        i += 10;
      }

      rubAliexpress = Utils.normalizePrice(rates[i]?.toString());
    }

    return {rubAliexpress};
  }

  protected async get2CryptocalcInfo(): Promise<{ethUsd: string; btcUsd: string; etcUsd: string; ergUsd: string}> {
    let ethUsd: string;
    let btcUsd: string;
    let etcUsd: string;
    let ergUsd: string;

    const content = await this.fetch('https://2cryptocalc.com/').then(r => r.text());
    {
      const regex = `crypto-coin__abbr">(?<coin>.*?)<.*?Price.*?text-val">(?<price>.*?)<`;
      const match = content.matchAll(new RegExp(regex, 'gms'));
      const rates: {coin?: string; price?: string}[] = Array.from(match, m => ({
        coin: m.groups?.coin,
        price: m.groups?.price.replace(/\s/g, ''),
      }));

      ethUsd = rates.find(c => c.coin === 'ETH')?.price || '???';
      btcUsd = rates.find(c => c.coin === 'BTC')?.price || '???';
      etcUsd = rates.find(c => c.coin === 'ETC')?.price || '???';
      ergUsd = rates.find(c => c.coin === 'ERG')?.price || '???';
    }

    return {
      ethUsd: Utils.normalizePrice(ethUsd),
      btcUsd: Utils.normalizePrice(btcUsd),
      etcUsd: Utils.normalizePrice(etcUsd),
      ergUsd: Utils.normalizePrice(ergUsd),
    };
  }

  protected async getCoinGeckoInfo(): Promise<CryptoTicker[]> {
    const cryptoNames = [
      //
      'bitcoin',
      'ethereum',
      'ethereum-classic',
      'ergo',
      'the-open-network',
      'solana',
    ];

    const data = await this.fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + cryptoNames.join(','),
    ).then(r => r.json());

    return data.map(
      (item: any): CryptoTicker => ({
        symbol: item?.symbol.toUpperCase(),
        price: Utils.normalizePrice(item?.current_price),
        priceCurrency: 'USD',
        priceDiffPercentage: Utils.normalizePrice(item?.price_change_percentage_24h)
          .replace('-', '–')
          .replace(/^(?=\d)/, '+'),
        priceDirection:
          item?.price_change_percentage_24h > 0
            ? this.t(`${this.name}.priceDirectionUp`)
            : this.t(`${this.name}.priceDirectionDown`),
      }),
    );
  }

  protected logFetchError(e: FetchError) {
    this.log(`Error: status ${(e as FetchError).code}. ` + (e as FetchError).message);
  }

  protected async onRateCommand(ctx: ContextWithMatch) {
    await this.tellRate(ctx);
  }
}
