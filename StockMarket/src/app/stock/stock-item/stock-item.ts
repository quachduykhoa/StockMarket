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

  constructor(private stockService: StockService, private messageService: MessageService) {}

  toggleFavorite() {
    this.stockService.toggleFavorite(this.stock).subscribe({
      next: (updated) => (this.stock.favorite = updated.favorite),
      error: (err: Error) => this.messageService.error(err.message),
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
