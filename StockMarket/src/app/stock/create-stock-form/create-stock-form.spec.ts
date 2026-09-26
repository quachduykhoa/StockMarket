import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockForm } from './create-stock-form';

describe('CreateStockForm', () => {
  let component: CreateStockForm;
  let fixture: ComponentFixture<CreateStockForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStockForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStockForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
