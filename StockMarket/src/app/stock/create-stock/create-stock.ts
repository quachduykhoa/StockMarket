import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Stock } from '../../model/stock';

@Component({
  selector: 'app-create-stock',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-stock.html',
  styleUrl: './create-stock.css',
})
export class CreateStock {
  public stock: Stock = {
    name: '',
    code: '',
    price: 0,
    previousPrice: 0,
    exchange: '',
    favorite: false,
  };
  public confirmed: boolean = false;
  public exchanges: string[] = ['NYSE', 'NASDAQ', 'OTHER'];

  setStockPrice(price: number) {
    this.stock.price = price;
  }

  createStock(form: NgForm) {
    console.log('Creating stock with information: ', this.stock);
  }
}
