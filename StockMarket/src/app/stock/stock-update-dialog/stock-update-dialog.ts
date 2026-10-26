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
  @Input() stock: Stock | null = null;
  @Output() closed = new EventEmitter<void>();

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
    const updated: Stock = {
      id: this.stock.id,
      name: value.name ?? this.stock.name,
      code: this.stock.code,
      price: Number(value.price ?? 0),
      previousPrice: Number(value.previousPrice ?? 0),
      exchange: value.exchange ?? 'OTHER',
      favorite: this.stock.favorite,
    };

    this.stockService.updateStock(this.stock.id!, updated).subscribe({
      next: (saved) => {
        Object.assign(this.stock!, saved);
        this.close();
      },
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
