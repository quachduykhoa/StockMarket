import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-stock-item',
  imports: [RouterLink, CurrencyPipe, UpperCasePipe],
  templateUrl: './stock-item.html',
  styleUrl: './stock-item.css',
})
export class StockItem {
  @Input({ required: true }) stock!: Stock; 
  @Output() detail = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();

  @Output() remove = new EventEmitter<void>();

  isUpdatingFavorite = false;

  constructor(private stockService: StockService, private messageService: MessageService) {}

  
  toggleFavorite() {
    if (this.isUpdatingFavorite) {
      return;
    }

    if (this.stock.id === undefined) {
      this.messageService.error(
        'Không thể cập nhật Favorite vì thiếu Stock ID.'
      );
      return;
    }

    this.isUpdatingFavorite = true;

    this.stockService.toggleFavorite(this.stock).subscribe({

      next: (updated) => {

        this.stock.favorite = updated.favorite;

        this.messageService.success(
          updated.favorite
            ? `${this.stock.code} đã được thêm vào Favorite.`
            : `${this.stock.code} đã được xóa khỏi Favorite.`
        );

        this.isUpdatingFavorite = false;
      },

      error: (err: Error) => {

        this.messageService.error(err.message);

        this.isUpdatingFavorite = false;
      },

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
