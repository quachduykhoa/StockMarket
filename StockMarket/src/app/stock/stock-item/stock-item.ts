import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stock } from '../../model/stock';

@Component({
  selector: 'app-stock-item',
  imports: [],
  templateUrl: './stock-item.html',
  styleUrl: './stock-item.css',
})
export class StockItem {
  @Input({ required: true }) stock!: Stock; //đánh dấu cổng đầu vào
  @Output() favoriteChange = new EventEmitter<boolean>();
  @Output() detail = new EventEmitter<void>(); //xem chi tiết
  @Output() update = new EventEmitter<void>(); //cập nhật
  @Output() remove = new EventEmitter<void>(); //xóa

  toggleFavorite() {
    this.favoriteChange.emit(!this.stock.favorite);
  }

  showDetail() {
    this.detail.emit();
  }

  showUpdate() {
    this.update.emit();
  }

  showDelete() {
    this.remove.emit();
  }

  /** Phần trăm thay đổi giá so với phiên trước: +6.25 / -2.40 */
  get changePercent(): string {
    if (!this.stock.previousPrice) {
      return '0.00';
    }

    const percent =
      ((this.stock.price - this.stock.previousPrice) /
        this.stock.previousPrice) *
      100;

    return percent.toFixed(2);
  }
}
