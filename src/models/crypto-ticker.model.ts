export interface CryptoTicker {
  symbol: string;
  price: string;
  priceCurrency: string;
  priceDiffPercentage?: string;
  priceDirection?: string;
}
