import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';
import { CreateStockForm } from '../create-stock-form/create-stock-form';
import { StockItem } from '../stock-item/stock-item';
import { StockDetailDialog } from '../stock-detail-dialog/stock-detail-dialog';
import { StockUpdateDialog } from '../stock-update-dialog/stock-update-dialog';

@Component({
  selector: 'app-stock-list',
  imports: [StockItem, CreateStockForm, FormsModule, StockDetailDialog, StockUpdateDialog],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
})

//component cha: nhận dữ liệu từ StockService
export class StockList implements OnInit {
  stocks: Stock[] = [];
  searchTerm = '';
  selectedStock: Stock | null = null;
  stockToUpdate: Stock | null = null; //cổ phiếu đang mở trong dialog Update

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.stockService.getStocks().subscribe({
      next: (stocks) => (this.stocks = stocks),
      error: (err: Error) => console.log(err.message),
    });
  }

  //danh sách hiển thị: đã lọc theo ô tìm kiếm
  get filteredStocks(): Stock[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) { //chưa nhập gì hết
      return this.stocks;
    }

    return this.stocks.filter(
      (each) =>
        each.name.toLowerCase().includes(term) ||
        each.code.toLowerCase().includes(term) ||
        each.exchange?.toLowerCase().includes(term),
    );
  }

  toggleFavorite(stock: Stock) {
    this.stockService.toggleFavorite(stock).subscribe({
      error: (err: Error) => console.log(err.message),
    });
  }

  openDetail(stock: Stock) {
    this.selectedStock = stock;
  }

  openUpdate(stock: Stock) {
    this.stockToUpdate = stock;
  }

  deleteStock(stock: Stock) {
    this.stockService.deleteStock(stock.code).subscribe({
      next: (removed) => console.log('Removed stock: ' + removed.code),
      error: (err: Error) => console.log(err.message),
    });
  }
}   