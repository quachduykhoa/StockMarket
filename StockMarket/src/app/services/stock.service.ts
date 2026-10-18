import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Stock } from '../model/stock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private stocks: Stock[];

  constructor() {
    this.stocks = [
      new Stock('Test Stock Company', 'TSC', 85, 80, 'NASDAQ'),
      new Stock('Second Stock Company', 'SSC', 10, 12, 'NYSE'),
      new Stock('Last Stock Company', 'LSC', 876, 860, 'NYSE'),
      new Stock('My New Stock', 'MNS', 244, 220, 'NASDAQ'),
    ];
  }

  // lấy dữ liệu : trả về một Observable chứa danh sách Stock
  getStocks(): Observable<Stock[]> {
    return of(this.stocks);
  }  //subscribe() sẽ nhận được danh sách Stock từ Observable này

  createStock(stock: Stock): Observable<Stock> {
    const foundStock = this.stocks.find((each) => each.code === stock.code);
    if (foundStock) {
      return throwError(
        () => new Error('Stock with code ' + stock.code + ' already exists'),
      );
    }

    this.stocks.push(stock);
    return of(stock);
  }

  toggleFavorite(stock: Stock): Observable<Stock> {
    const foundStock = this.stocks.find((each) => each.code === stock.code);
    if (!foundStock) {
      return throwError(
        () => new Error('Stock with code ' + stock.code + ' was not found'),
      );
    }

    foundStock.favorite = !foundStock.favorite;
    return of(foundStock);
  }

  deleteStock(code: string): Observable<Stock> {
    const foundIndex = this.stocks.findIndex((each) => each.code === code);
    if (foundIndex === -1) {
      return throwError(
        () => new Error('Stock with code ' + code + ' was not found'),
      );
    }

    const [removed] = this.stocks.splice(foundIndex, 1); //xóa 1 phần tử khỏi mảng
    return of(removed);
  }

    updateStock(stock: Stock): Observable<Stock> {
    const foundStock = this.stocks.find((each) => each.code === stock.code);
    if (!foundStock) {
      return throwError(
        () => new Error('Stock with code ' + stock.code + ' was not found'),
      );
    }

    foundStock.name = stock.name;
    foundStock.price = stock.price;
    foundStock.previousPrice = stock.previousPrice;
    foundStock.exchange = stock.exchange;
    return of(foundStock);
  }
}