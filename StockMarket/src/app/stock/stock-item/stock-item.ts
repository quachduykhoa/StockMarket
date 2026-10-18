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
  @Output() detail = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();

  @Output() remove = new EventEmitter<void>();

  toggleFavorite() {
    this.favoriteChange.emit(!this.stock.favorite);
  }

  showDetail() {
    this.detail.emit();
  }

  showUpdate() {
    this.update.emit();
  }

  removeStock() {
    this.remove.emit();
  }
}
