import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stock } from '../../model/stock';

import { StockItem } from './stock-item';

describe('StockItem', () => {
  let component: StockItem;
  let fixture: ComponentFixture<StockItem>;

  const button = (selector: string) =>
    fixture.nativeElement.querySelector(selector) as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockItem],
    }).compileComponents();

    fixture = TestBed.createComponent(StockItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'stock',
      new Stock('Example Company', 'EXM', 10, 8),
    );
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the row information', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Example Company');
    expect(text).toContain('EXM');
    expect(text).toContain('$ 10');
    expect(text).toContain('25.00%');
  });

  it('emits favoriteChange with the new state', () => {
    let emitted: boolean | undefined;
    component.favoriteChange.subscribe((value) => (emitted = value));

    button('.btn-favorite').click();

    expect(emitted).toBe(true);
  });

  it('emits detail, update and remove actions', () => {
    let detail = 0;
    let update = 0;
    let remove = 0;
    component.detail.subscribe(() => detail++);
    component.update.subscribe(() => update++);
    component.remove.subscribe(() => remove++);

    button('.btn-detail').click();
    button('.btn-update').click();
    button('.btn-delete').click();

    expect(detail).toBe(1);
    expect(update).toBe(1);
    expect(remove).toBe(1);
  });
});
