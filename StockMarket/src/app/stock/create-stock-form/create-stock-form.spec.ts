import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CreateStockForm } from './create-stock-form';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../model/stock';

describe('CreateStockForm', () => {
  let component: CreateStockForm;
  let fixture: ComponentFixture<CreateStockForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStockForm],
      providers: [
        { provide: StockService, useValue: { createStock: (stock: Stock) => of(stock) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStockForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
