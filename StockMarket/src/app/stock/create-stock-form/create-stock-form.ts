import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-create-stock-form',
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-stock-form.html',
  styleUrl: './create-stock-form.css',
})
export class CreateStockForm {

  @Output() stockCreated = new EventEmitter<Stock>();

  public stockForm!: FormGroup;
  public exchanges: string[] = ['NYSE', 'NASDAQ', 'OTHER'];

  //thông báo hiển thị trên form
  public message = '';
  public messageType: 'success' | 'error' = 'success';

  private counter = 1;

  constructor(private fb: FormBuilder, private stockService: StockService) {
    this.createForm();
  }

  createForm(){
    this.stockForm = this.fb.group({
        name: ['', Validators.required],
        code: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]],
      exchange: ['NYSE']
    });
  }

  // stockForm = new FormGroup({
  //   name: new FormControl(null, Validators.required),
  //   code: new FormControl(null, [Validators.required, Validators.minLength(2)]),
  //   price: new FormControl(0, [Validators.required, Validators.min(1)])
  // });

  // Getters giúp lấy nhanh control ngoài file HTML
  get name() { return this.stockForm.get('name'); }
  get code() { return this.stockForm.get('code'); }
  get price() { return this.stockForm.get('price'); }

  //  Reset Form
  resetForm() {
    this.stockForm.reset({ name: '', code: '', price: 0, exchange: 'NYSE' });
  }

  // loadStockFromServer() {
  //   this.stock = new Stock('Test ' + this.counter++, 'TST', 20, 10);
  //   this.stockForm.setValue({
  //     name: this.stock.name,
  //     code: this.stock.code,
  //     price: this.stock.price
  //   });
  // }

  patchStockForm() {
    this.stockForm.patchValue({
      name: `Test ${this.counter++}`,
      code: 'TST',
      price: 20,
      exchange: 'NYSE'
    });
  }

  onSubmit() {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    const formValue = this.stockForm.getRawValue();
    const price = Number(formValue.price ?? 0);
    const stock: Stock = {
      name: formValue.name ?? '',
      code: formValue.code ?? '',
      price,
      previousPrice: price,
      exchange: formValue.exchange ?? 'OTHER',
      favorite: false,
    };

    this.stockService.createStock(stock).subscribe({
      next: (created) => {
        this.messageType = 'success';
        this.message = 'Successfully created stock with stock code: ' + created.code;
        this.resetForm();
        this.stockCreated.emit(created);         
      },
      error: (err: Error) => {
        this.messageType = 'error';
        this.message = err.message;
      },
    });
  }
}