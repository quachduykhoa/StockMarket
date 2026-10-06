import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Stock } from '../../model/stock';

@Component({
  selector: 'app-create-stock-form',
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-stock-form.html',
  styleUrl: './create-stock-form.css',
})
export class CreateStockForm {
  // public nameControl = new FormControl();
  
  public stockForm!: FormGroup;
  public exchanges: string[] = ['NYSE', 'NASDAQ', 'OTHER'];
  @Output() stockCreated = new EventEmitter<Stock>();
  
  private counter = 1;
  
  constructor(private fb: FormBuilder) {
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
    const stock = new Stock(
      formValue.name ?? '',
      formValue.code ?? '',
      price,
      price,
      formValue.exchange ?? undefined
    );
    this.stockCreated.emit(stock);
    this.resetForm();
  }
}
