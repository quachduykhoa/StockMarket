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
import { FormsModule } from '@angular/forms';
import { Stock } from '../../model/stock';

/** Hộp thoại cập nhật thông tin một cổ phiếu. */
@Component({
  selector: 'app-stock-update-dialog',
  imports: [FormsModule],
  templateUrl: './stock-update-dialog.html',
  styleUrl: './stock-update-dialog.css',
})
export class StockUpdateDialog implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Stock>();

  @ViewChild('dialogRef') private dialogRef?: ElementRef<HTMLDialogElement>;

  private readonly platformId = inject(PLATFORM_ID);

  stockValue!: Stock;
  exchanges = ['NYSE', 'NASDAQ', 'OTHER'];

  name = '';
  price = 0;
  exchange = 'NYSE';
  errorMessage = '';

  @Input({ required: true })
  set stock(value: Stock) {
    this.stockValue = value;
    this.name = value.name;
    this.price = value.price;
    this.exchange = value.exchange ?? 'NYSE';
    this.errorMessage = '';
  }

  ngAfterViewInit() {
    const element = this.dialogRef?.nativeElement;
    if (!element) {
      return;
    }

    if (isPlatformBrowser(this.platformId) && element.showModal) {
      element.showModal();
    } else {
      element.setAttribute('open', '');
    }
  }

  saveChanges() {
    const name = this.name.trim();

    if (!name) {
      this.errorMessage = 'Stock name is required';
      return;
    }

    if (!Number.isFinite(this.price) || this.price <= 0) {
      this.errorMessage = 'Stock price must be greater than 0';
      return;
    }

    // Mã cổ phiếu là khóa, không cho đổi. Giá cũ trở thành giá "previous".
    const updated = new Stock(
      name,
      this.stockValue.code,
      this.price,
      this.stockValue.price,
      this.exchange,
    );
    updated.favorite = this.stockValue.favorite;

    this.save.emit(updated);
  }

  cancel() {
    this.closeDialog();
  }

  private closeDialog() {
    const element = this.dialogRef?.nativeElement;

    if (element?.close) {
      element.close();
    } else {
      this.close.emit();
    }
  }
}
