import { Stock } from './stock';

describe('Stock', () => {
  it('should create an instance', () => {
    expect(new Stock('Test Stock Company', 'TSC', 85, 80)).toBeTruthy();  });
});
