import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Register } from './register';
import { UserService } from '../services/user.service';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        // Register inject UserService (POST /users trong data.json qua json-server)
        { provide: UserService, useValue: { register: (user: { username: string; password: string }) => of(user) } },
        provideRouter([]), // Register inject Router (navigate sang login sau khi đăng ký)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
