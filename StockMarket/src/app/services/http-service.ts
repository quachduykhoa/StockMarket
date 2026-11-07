
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Stock } from '../model/stock';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly REST_API_SERVER = 'http://localhost:3000';

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}


  getStocks(): Observable<Stock[]> {
    return this.httpClient.get<Stock[]>(
      `${this.REST_API_SERVER}/stocks`
    );
  }

  getStocksByCode(code: string): Observable<Stock[]> {
    return this.httpClient.get<Stock[]>(
      `${this.REST_API_SERVER}/stocks`,
      {
        params: { code },
      }
    );
  }

  postStock(body: Stock): Observable<Stock> {
    return this.httpClient.post<Stock>(
      `${this.REST_API_SERVER}/stocks`,
      body,
      this.httpOptions
    );
  }

  putStock(id: number | string, body: Stock): Observable<Stock> {
    return this.httpClient.put<Stock>(
      `${this.REST_API_SERVER}/stocks/${id}`,
      body,
      this.httpOptions
    );
  }

  patchStock(
    id: number | string,
    body: Partial<Stock>
  ): Observable<Stock> {
    return this.httpClient.patch<Stock>(
      `${this.REST_API_SERVER}/stocks/${id}`,
      body,
      this.httpOptions
    );
  }

  deleteStock(id: number | string): Observable<Stock> {
    return this.httpClient.delete<Stock>(
      `${this.REST_API_SERVER}/stocks/${id}`
    );
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(
      `${this.REST_API_SERVER}/users`
    );
  }

  postUser(body: User): Observable<User> {
    return this.httpClient.post<User>(
      `${this.REST_API_SERVER}/users`,
      body,
      this.httpOptions
    );
  }

  getStocksAsResponse(): Observable<HttpResponse<Stock[]>> {
    return this.httpClient.get<Stock[]>(
      `${this.REST_API_SERVER}/stocks`,
      { observe: 'response' }
    );
  }

  getStocksAsEvents(): Observable<HttpEvent<any>> {
    return this.httpClient.get(
      `${this.REST_API_SERVER}/stocks`,
      { observe: 'events' }
    );
  }

  getStocksAsString(): Observable<string> {
    return this.httpClient.get(
      `${this.REST_API_SERVER}/stocks`,
      { responseType: 'text' }
    );
  }

  getStocksAsBlob(): Observable<Blob> {
    return this.httpClient.get(
      `${this.REST_API_SERVER}/stocks`,
      { responseType: 'blob' }
    );
  }
}
