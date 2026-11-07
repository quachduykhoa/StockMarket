
import { Injectable } from '@angular/core';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';

import { Stock } from '../model/stock';
import { HttpService } from './http-service';

@Injectable({
  providedIn: 'root',
})
export class StockService {

  constructor(private http: HttpService) {}

  getStocks(): Observable<Stock[]> {
    return this.http.getStocks();
  }

  getStockByCode(code: string): Observable<Stock> {
    return this.http.getStocksByCode(code).pipe(
      map((stocks) => stocks[0])
    );
  }

  createStock(stock: Stock): Observable<Stock> {
    return this.http.postStock(stock);
  }

  updateStock(id: number, stock: Stock): Observable<Stock> {
    return this.http.putStock(id, stock);
  }

  toggleFavorite(stock: Stock): Observable<Stock> {

    if (stock.id === undefined) {
      return throwError(
        () => new Error('Không thể cập nhật Stock vì thiếu ID.')
      );
    }

    return this.http.patchStock(
      stock.id,
      { favorite: !stock.favorite }
    );
  }

  deleteStock(id: number): Observable<Stock> {
    return this.http.deleteStock(id);
  }


  getStocksAsResponse(): Observable<HttpResponse<Stock[]>> {
    return this.http.getStocksAsResponse();
  }

  getStocksAsEvents(): Observable<HttpEvent<any>> {
    return this.http.getStocksAsEvents();
  }

  getStocksAsString(): Observable<string> {
    return this.http.getStocksAsString();
  }

  getStocksAsBlob(): Observable<Blob> {
    return this.http.getStocksAsBlob();
  }
}
