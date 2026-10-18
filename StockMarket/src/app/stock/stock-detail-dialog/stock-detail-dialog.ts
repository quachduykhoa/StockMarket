import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Stock } from '../../model/stock';

@Component({
  selector: 'app-stock-detail-dialog',
  imports: [],
  templateUrl: './stock-detail-dialog.html',
  styleUrl: './stock-detail-dialog.css',
})
export class StockDetailDialog implements AfterViewInit {
  @Input() stock: Stock | null = null; //cổ phiếu cần xem chi tiết
  @Output() closed = new EventEmitter<void>(); //báo cha: mình đã đóng

  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;//tham chiếu đến thẻ dialog trong template

  ngAfterViewInit() {
    //view đã render xong → mở modal ngay
    this.dialog?.nativeElement.showModal();
  }

  close() {
    this.dialog?.nativeElement.close();
  }

  changePercent(): string {
    const stock = this.stock;
    if (!stock || !stock.previousPrice) {
      return '0.00';
    }

    const percent =
      ((stock.price - stock.previousPrice) / stock.previousPrice) * 100;
    return (percent >= 0 ? '+' : '') + percent.toFixed(2);
  }
}