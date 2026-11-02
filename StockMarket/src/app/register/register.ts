import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  username = '';
  password = '';
  confirmPassword = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  register() {
    if (!this.username || !this.password) {
      this.messageService.error('Vui lòng nhập đầy đủ username và password');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.messageService.error('Password và Confirm password không khớp nhau');
      return;
    }

    const user: User = { username: this.username, password: this.password };

    this.userService.register(user).subscribe({
      next: () => {
        // trang 37-38: đăng ký xong → navigate sang trang Login
        this.messageService.success('Đăng ký thành công! Mời đăng nhập.');
        this.router.navigate(['login']);
      },
      error: (err: Error) => {
        this.messageService.error(err.message);
      },
    });
  }
}
