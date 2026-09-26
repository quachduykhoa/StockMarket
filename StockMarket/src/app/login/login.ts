import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, JsonPipe],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {

    if (this.username === 'khoa' && this.password === '123456') {

      console.log('Login successful');
      this.errorMessage = '';

      this.router.navigate(['/stock-item']);

    } else {

      console.log('Username or password is incorrect');
      this.errorMessage = 'Username or password is incorrect';

    }
  }
}