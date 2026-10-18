import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CreateStockForm } from '../create-stock-form/create-stock-form';
import { StockList } from './stock-list';

describe('StockList', () => {
  let component: StockList;
  let fixture: ComponentFixture<StockList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockList],
    }).compileComponents();

    fixture = TestBed.createComponent(StockList);
    component = fixture.componentInstance;
    await fixture.whenStable();
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

  it('updates favorite state through the stock item output', () => {
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
