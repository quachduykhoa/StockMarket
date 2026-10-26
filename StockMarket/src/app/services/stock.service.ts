import { Injectable } from '@angular/core';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  createStock(stock: Stock): Observable<Stock> {
    return this.http.postStock(stock);
  }

  updateStock(id: string, stock: Stock): Observable<Stock> {
    return this.http.putStock(id, stock);
  }

  deleteStock(id: string): Observable<Stock> {
    return this.http.deleteStock(id);
  }

  toggleFavorite(stock: Stock): Observable<Stock> {
    return this.http.patchStock(stock.id!, { favorite: !stock.favorite });
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
