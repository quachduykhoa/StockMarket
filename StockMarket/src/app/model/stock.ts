export interface Stock {
  id?: number;
  name: string;
  code: string;
  price: number;
  previousPrice: number;
  exchange: string;
  favorite: boolean;
}