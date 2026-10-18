import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stock } from '../../model/stock';

import { StockItem } from './stock-item';

describe('StockItem', () => {
  let component: StockItem;
  let fixture: ComponentFixture<StockItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockItem],
    }).compileComponents();

    fixture = TestBed.createComponent(StockItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('stock', new Stock('Example Company', 'EXM', 10, 8));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
