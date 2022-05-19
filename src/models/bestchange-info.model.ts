export interface BestchangeInfo {
  fromSymbol: string;
  toSymbol: string;
  exchanges: {title: string; price: string}[];
  url: string;
}
