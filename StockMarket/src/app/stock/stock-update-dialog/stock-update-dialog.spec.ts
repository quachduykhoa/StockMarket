import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stock } from '../../model/stock';
import { StockUpdateDialog } from './stock-update-dialog';

describe('StockUpdateDialog', () => {
  let component: StockUpdateDialog;
  let fixture: ComponentFixture<StockUpdateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockUpdateDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(StockUpdateDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'stock',
      new Stock('Example Company', 'EXM', 10, 8, 'NASDAQ'),
    );
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and copy the stock values into the form', () => {
    expect(component).toBeTruthy();
    expect(component.name).toBe('Example Company');
    expect(component.price).toBe(10);
    expect(component.exchange).toBe('NASDAQ');
  });

  it('requires a name before saving', () => {
    let saved: Stock | undefined;
    component.save.subscribe((value) => (saved = value));

    component.name = '   ';
    component.saveChanges();

    expect(saved).toBeUndefined();
    expect(component.errorMessage).toContain('name');
  });

  it('emits an updated stock, keeping the code and favorite flag', () => {
    component.stockValue.favorite = true;

    let saved: Stock | undefined;
    component.save.subscribe((value) => (saved = value));

    component.name = 'Renamed Company';
    component.price = 20;
    component.saveChanges();

    expect(saved?.name).toBe('Renamed Company');
    expect(saved?.code).toBe('EXM');
    expect(saved?.price).toBe(20);
    expect(saved?.previousPrice).toBe(10);
    expect(saved?.favorite).toBe(true);
  });

  it('emits close when cancelled', () => {
    let closed = 0;
    component.close.subscribe(() => closed++);

    component.cancel();

    expect(closed).toBe(1);
  });
});
