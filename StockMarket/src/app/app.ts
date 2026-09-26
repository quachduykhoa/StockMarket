import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StockItem } from './stock/stock-item/stock-item';
import { CreateStock } from './stock/create-stock/create-stock';
import { CreateStockForm } from './stock/create-stock-form/create-stock-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StockItem, CreateStock,CreateStockForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('StockMarket');

  constructor(public router: Router) {}
}
