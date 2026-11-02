import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';
import { MessageService } from '../../services/message.service';
import { StockItem } from '../stock-item/stock-item';
import { StockDetailDialog } from '../stock-detail-dialog/stock-detail-dialog';
import { StockUpdateDialog } from '../stock-update-dialog/stock-update-dialog';

@Component({
  selector: 'app-stock-list',
  imports: [StockItem, FormsModule, StockDetailDialog, StockUpdateDialog],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
})


export class StockList implements OnInit {
  stocks: Stock[] = [];
  searchTerm = '';
  selectedStock: Stock | null = null;
  stockToUpdate: Stock | null = null;

  constructor(private stockService: StockService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadStocks();
  }

  private loadStocks() {
    this.stockService.getStocks().subscribe({
      next: (stocks) => (this.stocks = stocks),
      error: (err: Error) => this.messageService.error(err.message),
    });
  }


  get filteredStocks(): Stock[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.stocks;
    }

    return this.stocks.filter(
      (each) =>
        each.name.toLowerCase().includes(term) ||
        each.code.toLowerCase().includes(term) ||
        each.exchange?.toLowerCase().includes(term),
    );
  }

  openDetail(stock: Stock) {
    this.selectedStock = stock;
  }

  openUpdate(stock: Stock) {
    this.stockToUpdate = stock;
  }

  deleteStock(stock: Stock) {
    this.stockService.deleteStock(stock.id!).subscribe({
      next: () => {
        this.stocks = this.stocks.filter((each) => each.id !== stock.id);
      },
      error: (err: Error) => this.messageService.error(err.message),
    });
  }
}
