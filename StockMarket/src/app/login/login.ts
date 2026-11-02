import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, JsonPipe],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  login() {

    this.userService.login(this.username, this.password).subscribe({
      next: (users) => {
        if (users.length > 0) {
          console.log('Login successful');
          this.messageService.clear();
          this.router.navigate(['/stock-item']);
        } else {
          console.log('Username or password is incorrect');
          this.messageService.error('Username or password is incorrect');
        }
      },
      error: (err: Error) => {
        console.log('Login error', err.message);
        this.messageService.error(err.message);
      },
    });
  }
}
