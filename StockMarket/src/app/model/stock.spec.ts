import { Stock } from './stock';

describe('Stock', () => {
  it('should create an instance', () => {
    const stock: Stock = {
      name: 'Test Stock Company',
      code: 'TSC',
      price: 85,
      previousPrice: 80,
      exchange: 'NASDAQ',
      favorite: false,
    };
    expect(stock).toBeTruthy();
    expect(stock.code).toBe('TSC');
  });
});
