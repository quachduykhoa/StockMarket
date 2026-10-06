import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';
import { CreateStockForm } from '../create-stock-form/create-stock-form';
import { StockDetailDialog } from '../stock-detail-dialog/stock-detail-dialog';
import { StockItem } from '../stock-item/stock-item';
import { StockUpdateDialog } from '../stock-update-dialog/stock-update-dialog';

@Component({
  selector: 'app-stock-list',
  imports: [
    StockItem,
    CreateStockForm,
    StockDetailDialog,
    StockUpdateDialog,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
})
// component cha: nhận dữ liệu từ StockService và chia sẻ cho các component con
export class StockList {
  private readonly stockService = inject(StockService);

  /** Từ khóa tìm kiếm – điều khiển stream danh sách bên dưới. */
  private readonly keyword$ = new BehaviorSubject<string>('');

  /** Danh sách hiển thị: vừa là kết quả tìm kiếm, vừa tự cập nhật khi CRUD. */
  readonly stocks$: Observable<Stock[]> = this.keyword$.pipe(
    switchMap((keyword) => this.stockService.searchStocks(keyword)),
  );

  searchTerm = '';
  errorMessage = '';

  /** Cổ phiếu đang xem chi tiết / cập nhật – null thì dialog đóng. */
  detailTarget: Stock | null = null;
  updateTarget: Stock | null = null;

  onSearch() {
    this.keyword$.next(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.keyword$.next('');
  }

  addStock(stock: Stock) {
    // Observable cần được subscribe: next = thành công, error = throwError() từ service
    this.stockService.addStock(stock).subscribe({
      next: () => (this.errorMessage = ''),
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  deleteStock(stock: Stock) {
    this.stockService.deleteStock(stock.code).subscribe({
      next: () => (this.errorMessage = ''),
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  showDetail(stock: Stock) {
    this.detailTarget = stock;
  }

  showUpdate(stock: Stock) {
    this.updateTarget = stock;
  }

  saveUpdate(stock: Stock) {
    this.stockService.updateStock(stock).subscribe({
      next: () => {
        this.errorMessage = '';
        this.updateTarget = null;
      },
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  toggleFavorite(stock: Stock, favorite: boolean) {
    stock.favorite = favorite;
  }
}
