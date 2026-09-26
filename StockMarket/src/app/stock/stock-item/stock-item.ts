import { Component, OnInit } from '@angular/core';
import { Stock } from '../../model/stock';

@Component({
  selector: 'app-stock-item',
  imports: [],
  templateUrl: './stock-item.html',
  styleUrl: './stock-item.css',
})
export class StockItem implements OnInit {
  public stock!: Stock;
 
  constructor() {}

  ngOnInit() {
    this.stock = new Stock('Tesst Stock Company', 'TSC', 85, 80);
  }

  toggleFavorite(event: Event) {
    console.log('We are toggling the favorite state for this stock', event);
    this.stock.favorite = !this.stock.favorite;
  }
}
