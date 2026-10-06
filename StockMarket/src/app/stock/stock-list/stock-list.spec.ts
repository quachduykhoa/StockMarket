import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';
import { CreateStockForm } from '../create-stock-form/create-stock-form';
import { StockUpdateDialog } from '../stock-update-dialog/stock-update-dialog';
import { StockList } from './stock-list';

describe('StockList', () => {
  let component: StockList;
  let fixture: ComponentFixture<StockList>;
  let service: StockService;

  const rows = () =>
    fixture.nativeElement.querySelectorAll('.stock-list li') as NodeListOf<HTMLElement>;

  const rowButton = (index: number, selector: string) =>
    rows()[index].querySelector(selector) as HTMLButtonElement;

  const refresh = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const stocks = () => {
    let value: Stock[] = [];
    service.getStocks().subscribe((list) => (value = list));
    return value;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockList],
    }).compileComponents();

    fixture = TestBed.createComponent(StockList);
    component = fixture.componentInstance;
    service = TestBed.inject(StockService);

    await refresh();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the stocks provided by the service as a listview', () => {
    expect(rows()).toHaveLength(4);
    expect(fixture.nativeElement.textContent).toContain('Test Stock Company');
    expect(fixture.nativeElement.textContent).toContain('4 stocks');
  });

  it('filters the listview while searching', async () => {
    component.searchTerm = 'nas';
    component.onSearch();
    await refresh();

    expect(rows()).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('TSC');
    expect(fixture.nativeElement.textContent).not.toContain('Second Stock');

    component.clearSearch();
    await refresh();

    expect(rows()).toHaveLength(4);
  });

  it('shows an empty state when nothing matches', async () => {
    component.searchTerm = 'zzz';
    component.onSearch();
    await refresh();

    expect(rows()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain(
      'No stock matches your search.',
    );
  });

  it('adds a valid stock submitted by the form', async () => {
    const form = fixture.debugElement.query(By.directive(CreateStockForm))
      .componentInstance as CreateStockForm;
    form.stockForm.setValue({
      name: 'New Company',
      code: 'NEW',
      price: 45,
      exchange: 'NASDAQ',
    });

    form.onSubmit();
    await refresh();

    expect(stocks()).toHaveLength(5);
    expect(fixture.nativeElement.textContent).toContain('New Company');
  });

  it('shows an error when the code already exists', async () => {
    const form = fixture.debugElement.query(By.directive(CreateStockForm))
      .componentInstance as CreateStockForm;
    form.stockForm.setValue({
      name: 'Duplicate Company',
      code: 'TSC',
      price: 45,
      exchange: 'NYSE',
    });

    form.onSubmit();
    await refresh();

    expect(stocks()).toHaveLength(4);
    expect(component.errorMessage).toContain('TSC');
  });

  it('deletes a stock from the service and the listview', async () => {
    rowButton(0, '.btn-delete').click();
    await refresh();

    expect(stocks()).toHaveLength(3);
    expect(stocks().some((stock) => stock.code === 'TSC')).toBe(false);
    expect(rows()).toHaveLength(3);
  });

  it('opens the detail dialog and closes it again', async () => {
    rowButton(1, '.btn-detail').click();
    await refresh();

    expect(component.detailTarget?.code).toBe('SSC');
    expect(fixture.nativeElement.textContent).toContain('Second Stock Company');

    (
      fixture.nativeElement.querySelector(
        'app-stock-detail-dialog .dialog-footer button',
      ) as HTMLButtonElement
    ).click();
    await refresh();

    expect(component.detailTarget).toBeNull();
    expect(
      fixture.nativeElement.querySelector('app-stock-detail-dialog'),
    ).toBeNull();
  });

  it('updates a stock through the update dialog', async () => {
    rowButton(0, '.btn-update').click();
    await refresh();

    expect(component.updateTarget?.code).toBe('TSC');

    const dialog = fixture.debugElement.query(
      By.directive(StockUpdateDialog),
    ).componentInstance as StockUpdateDialog;
    dialog.name = 'Test Stock Company Inc.';
    dialog.price = 120;
    dialog.saveChanges();
    await refresh();

    const updated = stocks().find((stock) => stock.code === 'TSC');
    expect(updated?.name).toBe('Test Stock Company Inc.');
    expect(updated?.price).toBe(120);
    expect(updated?.previousPrice).toBe(85);
    expect(component.updateTarget).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(
      'Test Stock Company Inc.',
    );
  });

  it('updates favorite state through the stock item output', async () => {
    rowButton(0, '.btn-favorite').click();
    await refresh();

    expect(stocks()[0].favorite).toBe(true);
    expect(rowButton(0, '.btn-favorite').textContent).toContain('★');
  });
});
