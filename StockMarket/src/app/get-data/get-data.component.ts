import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of, catchError, tap } from 'rxjs';
import { Stock } from '../model/stock';
import { HttpService } from '../services/http-service';

@Component({
  selector: 'app-get-data',
  imports: [AsyncPipe],
  templateUrl: './get-data.component.html',
  styleUrl: './get-data.component.css',
})
export class GetDataComponent implements OnInit {
  stocks$!: Observable<Stock[]>;
  loading = true;
  errorMessage = '';

  // trang GET demo của đề docx → dùng HttpService
  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.stocks$ = this.httpService.getStocks().pipe(
      tap(() => (this.loading = false)),
      catchError((err: Error) => {
        console.log('Không tải được dữ liệu', err);
        this.errorMessage =
          'Không kết nối được server. Hãy chạy "json-server --watch data.json" rồi thử lại.';
        this.loading = false;
        return of([]); 
      }),
    );
  }
}
