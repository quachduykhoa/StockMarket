import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Stock } from '../../model/stock';

import { StockItem } from './stock-item';
import { StockService } from '../../services/stock.service';

describe('StockItem', () => {
  let component: StockItem;
  let fixture: ComponentFixture<StockItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockItem],
      providers: [
        {
          provide: StockService,
          useValue: {
            toggleFavorite: (stock: Stock) =>
              of({ ...stock, favorite: !stock.favorite }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('stock', {
      name: 'Example Company',
      code: 'EXM',
      price: 10,
      previousPrice: 8,
      exchange: 'NYSE',
      favorite: false,
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
