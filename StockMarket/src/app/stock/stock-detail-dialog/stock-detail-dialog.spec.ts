import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stock } from '../../model/stock';
import { StockDetailDialog } from './stock-detail-dialog';

describe('StockDetailDialog', () => {
  let component: StockDetailDialog;
  let fixture: ComponentFixture<StockDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockDetailDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(StockDetailDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'stock',
      new Stock('Example Company', 'EXM', 10, 8, 'NASDAQ'),
    );
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and show the stock information', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(component).toBeTruthy();
    expect(text).toContain('Example Company');
    expect(text).toContain('NASDAQ');
    expect(text).toContain('25.00%');
  });

  it('emits close when the close button is clicked', () => {
    let closed = 0;
    component.close.subscribe(() => closed++);

    (
      fixture.nativeElement.querySelector('.dialog-footer button') as HTMLButtonElement
    ).click();

    expect(closed).toBe(1);
  });
});
