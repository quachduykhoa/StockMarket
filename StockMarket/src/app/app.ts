import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppMessage, MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // banner thông báo duy nhất của app — đọc từ MessageService
  // (lưu reference 1 lần: async pipe chỉ subscribe đúng 1 observable)
  readonly message$: Observable<AppMessage | null>;

  constructor(private messageService: MessageService) {
    this.message$ = messageService.message$;
  }

  clearMessage() {
    this.messageService.clear();
  }
}
