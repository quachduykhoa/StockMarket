import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';
import { Stock } from '../model/stock';

/**
 * StockService – nơi lưu trữ danh sách cổ phiếu DÙNG CHUNG cho mọi component.
 *
 * - BehaviorSubject là nguồn dữ liệu duy nhất (single source of truth).
 *   Khi danh sách thay đổi, mọi component đang theo dõi sẽ tự nhận bản mới.
 * - Mọi phương thức đọc/ghi đều trả về Observable để component xử lý bất đồng bộ
 *   (subscribe với 2 nhánh: next và error).
 * - Dữ liệu giả lập bất đồng bộ bằng of(), lỗi được báo qua throwError()
 *   (cú pháp RxJS v6+, thay cho Observable.of / Observable.throw).
 */
@Injectable({
  providedIn: 'root',
})
export class StockService {
  private readonly stocks$ = new BehaviorSubject<Stock[]>([
    new Stock('Test Stock Company', 'TSC', 85, 80, 'NASDAQ'),
    new Stock('Second Stock Company', 'SSC', 10, 12, 'NYSE'),
    new Stock('Last Stock Company', 'LSC', 876, 860, 'NYSE'),
    new Stock('My New Stock', 'MNS', 244, 220, 'NASDAQ'),
  ]);

  // ---------- READ ----------

  /** Lấy toàn bộ danh sách. */
  getStocks(): Observable<Stock[]> {
    return this.stocks$.asObservable();
  }

  /** Tìm kiếm theo tên, mã hoặc sàn giao dịch – luôn bám theo danh sách mới nhất. */
  searchStocks(keyword: string): Observable<Stock[]> {
    const key = keyword.trim().toLowerCase();

    return this.stocks$.pipe(
      map((stocks) =>
        key === ''
          ? stocks
          : stocks.filter(
              (stock) =>
                stock.name.toLowerCase().includes(key) ||
                stock.code.toLowerCase().includes(key) ||
                (stock.exchange ?? '').toLowerCase().includes(key),
            ),
      ),
    );
  }

  /** Lấy chi tiết một cổ phiếu theo mã. */
  getStock(code: string): Observable<Stock> {
    const stock = this.findByCode(code);

    return stock
      ? of(stock)
      : throwError(() => new Error(`Không tìm thấy mã cổ phiếu "${code}"`));
  }

  // ---------- CREATE ----------

  addStock(stock: Stock): Observable<Stock> {
    if (this.findByCode(stock.code)) {
      return throwError(
        () => new Error(`Mã cổ phiếu "${stock.code}" đã tồn tại`),
      );
    }

    this.stocks$.next([...this.stocks$.value, stock]);
    return of(stock);
  }

  // ---------- UPDATE ----------

  /** Cập nhật theo mã cổ phiếu (mã là khóa, không cho đổi khi sửa). */
  updateStock(stock: Stock): Observable<Stock> {
    const stocks = this.stocks$.value;
    const index = stocks.findIndex((item) => item.code === stock.code);

    if (index === -1) {
      return throwError(
        () => new Error(`Không tìm thấy mã cổ phiếu "${stock.code}"`),
      );
    }

    const updated = [...stocks];
    updated[index] = stock;
    this.stocks$.next(updated);

    return of(stock);
  }

  // ---------- DELETE ----------

  deleteStock(code: string): Observable<Stock> {
    const stock = this.findByCode(code);

    if (!stock) {
      return throwError(
        () => new Error(`Không tìm thấy mã cổ phiếu "${code}"`),
      );
    }

    this.stocks$.next(
      this.stocks$.value.filter((item) => item.code !== code),
    );

    return of(stock);
  }

  private findByCode(code: string): Stock | undefined {
    return this.stocks$.value.find((stock) => stock.code === code);
  }
}
