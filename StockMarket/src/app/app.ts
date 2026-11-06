import { Component, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { AppMessage, MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly message$: Observable<AppMessage | null>;

  // tham chiếu sidenav trong template để mở/đóng bằng code
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  isOpened = false;

  constructor(private messageService: MessageService) {
    this.message$ = messageService.message$;
  }

  openLeftSide() {
    this.isOpened = !this.isOpened;
    this.sidenav.toggle();
  }

  closeLeftSide() {
    this.isOpened = false;
  }

  clearMessage() {
    this.messageService.clear();
  }
}