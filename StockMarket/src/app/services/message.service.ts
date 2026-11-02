import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppMessage {
  text: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSubject = new BehaviorSubject<AppMessage | null>(null);
  readonly message$: Observable<AppMessage | null> = this.messageSubject.asObservable();

  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  success(text: string) {
    this.show({ text, type: 'success' });
  }

  error(text: string) {
    this.show({ text, type: 'error' });
  }

  clear() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.messageSubject.next(null);
  }

  private show(message: AppMessage) {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
    }
    this.showTimer = setTimeout(() => {
      this.showTimer = null;
      this.messageSubject.next(message);
    });

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.hideTimer = setTimeout(() => this.clear(), 5000);
  }
}
