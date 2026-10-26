import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-stock-item',
  imports: [],
  templateUrl: './stock-item.html',
  styleUrl: './stock-item.css',
})
export class StockItem {
  @Input({ required: true }) stock!: Stock; //đánh dấu cổng đầu vào
  @Output() detail = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();

  @Output() remove = new EventEmitter<void>();

  // trang 12–13: stock-item TỰ gọi service — không bắn favoriteChange lên cha nữa
  constructor(private stockService: StockService) {}

  toggleFavorite() {
    this.stockService.toggleFavorite(this.stock).subscribe({
      next: (updated) => (this.stock.favorite = updated.favorite),
      error: (err: Error) => console.log(err.message),
    });
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
