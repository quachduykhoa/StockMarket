import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators , FormBuilder} from '@angular/forms';
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
  private stock!: Stock;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm(){
    this.stockForm = this.fb.group({
      name: [null, Validators.required],
      code: [null, [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]]
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
    this.stockForm.reset();
  }

  // Giả lập load thông tin Stock từ Server và đổ vào Form
  // loadStockFromServer() {
  //   this.stock = {
  //     name: 'Test Stock Company',
  //     code: 'TSC',
  //     price: 1200,
  //     favorite: false,          // Bổ sung thêm
  //     previousPrice: 1000,      // Bổ sung thêm
  //     isPositiveChange: true
  //   };
  //   // Dùng patchValue để cập nhật dữ liệu vào Form
  //   this.stockForm.patchValue(this.stock);
  // }

  onSubmit() {
    // Lấy dữ liệu từ form gán lại vào đối tượng stock
    this.stock = Object.assign({}, this.stockForm.value);
    console.log('Saving stock model:', this.stock);
  }
}
