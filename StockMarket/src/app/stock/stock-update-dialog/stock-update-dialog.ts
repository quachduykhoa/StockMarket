import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-stock-update-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './stock-update-dialog.html',
  styleUrl: './stock-update-dialog.css',
})
export class StockUpdateDialog implements AfterViewInit, OnChanges {
  @Input() stock: Stock | null = null; //cổ phiếu cần cập nhật
  @Output() closed = new EventEmitter<void>(); //báo cha: mình đã đóng

  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;

  public stockForm: FormGroup;
  public message = '';
  public messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private stockService: StockService) {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      previousPrice: [0, [Validators.required, Validators.min(0)]],
      exchange: ['', Validators.required],
    });
  }

  //cha vừa gán input → đổ dữ liệu cũ vào form để sửa
  ngOnChanges(changes: SimpleChanges) {
    const stock: Stock | null = changes['stock']
      ? changes['stock'].currentValue
      : null;

    if (stock) {
      this.stockForm.setValue({
        name: stock.name,
        price: stock.price,
        previousPrice: stock.previousPrice,
        exchange: stock.exchange ?? 'OTHER',
      });
      this.message = '';
    }
  }

  ngAfterViewInit() {
    //view render xong → mở modal
    this.dialog?.nativeElement.showModal();
  }

  isInvalid(controlName: string): boolean {
    const control = this.stockForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  save() {
    if (this.stockForm.invalid || !this.stock) {
      this.stockForm.markAllAsTouched();
      this.message = 'Please fill in all required fields (price must be >= 0).';
      this.messageType = 'error';
      return;
    }

    const value = this.stockForm.getRawValue();
    const updated = new Stock(
      value.name ?? this.stock.name,
      this.stock.code, //khóa chính → giữ nguyên
      Number(value.price ?? 0),
      Number(value.previousPrice ?? 0),
      value.exchange ?? 'OTHER',
    );

    this.stockService.updateStock(updated).subscribe({
      next: () => this.close(),
      error: (err: Error) => {
        this.message = err.message;
        this.messageType = 'error';
      },
    });
  }

  close() {
    this.dialog?.nativeElement.close();
  }
}