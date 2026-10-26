import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StockService } from './stock.service';
import { HttpService } from './http-service';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // StockService không tự làm HTTP — mock HttpService để kiểm chứng ủy quyền
        { provide: HttpService, useValue: { getStocks: () => of([]) } },
      ],
    });
    service = TestBed.inject(StockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
