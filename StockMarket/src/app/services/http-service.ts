import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../model/stock';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private REST_API_SERVER = 'http://localhost:3000';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {}

  getStocks(): Observable<Stock[]> {
    return this.httpClient.get<Stock[]>(`${this.REST_API_SERVER}/stocks`, {
      headers: new HttpHeaders()
        .set('Authorization', 'MyAuthorizationHeaderValue')
        .set('X-EXAMPLE-HEADER', 'TestValue'),
      params: { price_gte: '0' },
    });
  }

  postStock(body: Stock): Observable<Stock> {
    const url = `${this.REST_API_SERVER}/stocks`;
    console.log('postStock=', url);
    console.log('postStock: body', body);
    return this.httpClient.post<Stock>(url, body, this.httpOptions);
  }

  putStock(id: string, body: Stock): Observable<Stock> {
    return this.httpClient.put<Stock>(`${this.REST_API_SERVER}/stocks/${id}`, body, this.httpOptions);
  }

  
  patchStock(id: string, body: Partial<Stock>): Observable<Stock> {
    return this.httpClient.patch<Stock>(`${this.REST_API_SERVER}/stocks/${id}`, body, this.httpOptions);
  }

  deleteStock(id: string): Observable<Stock> {
    return this.httpClient.delete<Stock>(`${this.REST_API_SERVER}/stocks/${id}`);
  }

  
  getStocksAsResponse(): Observable<HttpResponse<Stock[]>> {
    return this.httpClient.get<Stock[]>(`${this.REST_API_SERVER}/stocks`, {
      observe: 'response',
    });
  }

  getStocksAsEvents(): Observable<HttpEvent<any>> {
    return this.httpClient.get(`${this.REST_API_SERVER}/stocks`, {
      observe: 'events',
    });
  }

  getStocksAsString(): Observable<string> {
    return this.httpClient.get(`${this.REST_API_SERVER}/stocks`, {
      responseType: 'text',
    });
  }

  getStocksAsBlob(): Observable<Blob> {
    return this.httpClient.get(`${this.REST_API_SERVER}/stocks`, {
      responseType: 'blob',
    });
  }
}
