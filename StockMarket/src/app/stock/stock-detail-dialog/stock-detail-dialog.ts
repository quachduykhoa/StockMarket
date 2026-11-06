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
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-stock-detail-dialog',
  imports: [CurrencyPipe, UpperCasePipe],
  templateUrl: './stock-detail-dialog.html',
  styleUrl: './stock-detail-dialog.css',
})
export class StockDetailDialog implements AfterViewInit {
  @Input() stock: Stock | null = null; 
  @Output() closed = new EventEmitter<void>(); 

  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;

  ngAfterViewInit() {
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