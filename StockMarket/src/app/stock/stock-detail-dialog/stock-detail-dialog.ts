import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  PLATFORM_ID,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Stock } from '../../model/stock';

/** Hộp thoại xem chi tiết một cổ phiếu. */
@Component({
  selector: 'app-stock-detail-dialog',
  imports: [],
  templateUrl: './stock-detail-dialog.html',
  styleUrl: './stock-detail-dialog.css',
})
export class StockDetailDialog implements AfterViewInit {
  @Input({ required: true }) stock!: Stock;
  @Output() close = new EventEmitter<void>();

  @ViewChild('dialogRef') private dialogRef?: ElementRef<HTMLDialogElement>;

  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    const element = this.dialogRef?.nativeElement;
    if (!element) {
      return;
    }

    if (isPlatformBrowser(this.platformId) && element.showModal) {
      element.showModal(); // trình duyệt: modal + backdrop + Esc để đóng
    } else {
      element.setAttribute('open', ''); // môi trường test (jsdom) chưa hỗ trợ showModal
    }
  }

  closeDialog() {
    const element = this.dialogRef?.nativeElement;

    if (element?.close) {
      element.close(); // phát ra sự kiện (close) ở template
    } else {
      this.close.emit();
    }
  }

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
