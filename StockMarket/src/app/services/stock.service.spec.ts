import { TestBed } from '@angular/core/testing';

import { Stock } from '../model/stock';
import { StockService } from './stock.service';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns the shared seed list', () => {
    let stocks: Stock[] = [];
    service.getStocks().subscribe((value) => (stocks = value));

    expect(stocks).toHaveLength(4);
    expect(stocks[0].code).toBe('TSC');
  });

  it('adds a new stock and notifies subscribers', () => {
    let stocks: Stock[] = [];
    service.getStocks().subscribe((value) => (stocks = value));

    service.addStock(new Stock('Fresh Stock', 'FRS', 50, 48, 'NYSE')).subscribe();

    expect(stocks).toHaveLength(5);
    expect(stocks.at(-1)?.code).toBe('FRS');
  });

  it('rejects a stock whose code already exists', () => {
    let error: unknown;

    service
      .addStock(new Stock('Duplicate', 'TSC', 1, 1))
      .subscribe({ error: (e) => (error = e) });

    expect(error).toBeInstanceOf(Error);
  });

  it('updates an existing stock', () => {
    let updated: Stock | undefined;
    const stock = new Stock('Test Stock Company', 'TSC', 99, 80, 'NASDAQ');

    service.updateStock(stock).subscribe((value) => (updated = value));

    let stocks: Stock[] = [];
    service.getStocks().subscribe((value) => (stocks = value));

    expect(updated).toBe(stock);
    expect(stocks.find((item) => item.code === 'TSC')?.price).toBe(99);
  });

  it('reports an error when updating an unknown code', () => {
    let error: unknown;

    service
      .updateStock(new Stock('Ghost', 'NOPE', 1, 1))
      .subscribe({ error: (e) => (error = e) });

    expect(error).toBeInstanceOf(Error);
  });

  it('deletes a stock by code', () => {
    service.deleteStock('SSC').subscribe();

    let stocks: Stock[] = [];
    service.getStocks().subscribe((value) => (stocks = value));

    expect(stocks).toHaveLength(3);
    expect(stocks.some((item) => item.code === 'SSC')).toBe(false);
  });

  it('reports an error when deleting an unknown code', () => {
    let error: unknown;

    service.deleteStock('NOPE').subscribe({ error: (e) => (error = e) });

    expect(error).toBeInstanceOf(Error);
  });

  it('searches by name, code or exchange, case-insensitively', () => {
    let stocks: Stock[] = [];
    service.searchStocks('nas').subscribe((value) => (stocks = value));

    expect(stocks.map((item) => item.code)).toEqual(['TSC', 'MNS']);

    service.searchStocks('lsc').subscribe((value) => (stocks = value));

    expect(stocks.map((item) => item.code)).toEqual(['LSC']);
  });

  it('returns the whole list for an empty keyword', () => {
    let stocks: Stock[] = [];
    service.searchStocks('   ').subscribe((value) => (stocks = value));

    expect(stocks).toHaveLength(4);
  });
});
