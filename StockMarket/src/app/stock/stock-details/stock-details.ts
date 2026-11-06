import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-stock-details',
  imports: [RouterLink, CurrencyPipe, UpperCasePipe],
  templateUrl: './stock-details.html',
  styleUrl: './stock-details.css',
})
export class StockDetailsComponent implements OnInit {
  public stock?: Stock;
  // true khi không tải được chi tiết — chi tiết lỗi hiển thị qua MessageService
  public loadFailed = false;

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute, 
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const stockCode = this.route.snapshot.paramMap.get('code');

    if (!stockCode) {
      this.loadFailed = true;
      this.messageService.error('Thiếu mã cổ phiếu trên URL');
      return;
    }

    this.stockService.getStockByCode(stockCode).subscribe({
      next: (stock) => {
        if (stock) {
          this.stock = stock;
        } else {
          this.loadFailed = true;
          this.messageService.error(`Không tìm thấy cổ phiếu với mã "${stockCode}"`);
        }
      },
      error: (err: Error) => {
        this.loadFailed = true;
        this.messageService.error(err.message);
      },
    });
  }
}
