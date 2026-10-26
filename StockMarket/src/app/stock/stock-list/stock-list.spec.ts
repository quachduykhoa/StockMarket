import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CreateStockForm } from '../create-stock-form/create-stock-form';
import { StockList } from './stock-list';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../model/stock';

function createStockServiceMock() {
  const store: Stock[] = [
    { name: 'Test Stock Company', code: 'TSC', price: 85, previousPrice: 80, exchange: 'NASDAQ', favorite: false },
    { name: 'Second Stock Company', code: 'SSC', price: 10, previousPrice: 12, exchange: 'NYSE', favorite: false },
    { name: 'Last Stock Company', code: 'LSC', price: 876, previousPrice: 860, exchange: 'NYSE', favorite: false },
    { name: 'My New Stock', code: 'MNS', price: 244, previousPrice: 220, exchange: 'NASDAQ', favorite: false },
  ].map((each: Stock, index) => {
    each.id = String(index + 1); 
    return each;
  });

  return {
    getStocks: () => of([...store]),
    createStock: (stock: Stock) => {
      stock.id = 'mock-' + (store.length + 1);
      store.push(stock);
      return of(stock);
    },
    updateStock: (id: string, stock: Stock) => of(stock),
    deleteStock: (id: string) => {
      const [removed] = store.splice(store.findIndex((s) => s.id === id), 1);
      return of(removed);
    },
    toggleFavorite: (stock: Stock) => of({ ...stock, favorite: !stock.favorite }),
    // stub cho demo Advanced HTTP (trang 30) — test không cần HTTP thật
    getStocksAsResponse: () => of(null as any),
    getStocksAsEvents: () => of(null as any),
    getStocksAsString: () => of(null as any),
    getStocksAsBlob: () => of(null as any),
  };
}

describe('StockList', () => {
  let component: StockList;
  let fixture: ComponentFixture<StockList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockList],
      providers: [
        { provide: StockService, useValue: createStockServiceMock() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockList);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a valid stock submitted by the form', () => {
    const form = fixture.debugElement.query(By.directive(CreateStockForm))
      .componentInstance as CreateStockForm;
    form.stockForm.setValue({
      name: 'New Company',
      code: 'NEW',
      price: 45,
      exchange: 'NASDAQ'
    });

    form.onSubmit();
    fixture.detectChanges();

    expect(component.stocks).toHaveLength(5);
    expect(fixture.nativeElement.textContent).toContain('New Company');
  });

  it('updates favorite state when the favorite button is clicked', () => {
    const favoriteButton = fixture.nativeElement.querySelector(
      '.stock-container button'
    ) as HTMLButtonElement;

    favoriteButton.click();
    fixture.detectChanges();

    expect(component.stocks[0].favorite).toBe(true);
    const updatedButton = fixture.nativeElement.querySelector(
      '.stock-container button'
    ) as HTMLButtonElement;
    expect(updatedButton.textContent).toContain('Remove from Favorite');
  });
});