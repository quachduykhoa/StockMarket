import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../model/user';
import { HttpService } from './http-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService) {}
  login(username: string, password: string): Observable<User[]> {
    return this.http.getUsers().pipe(
      map((users) => users.filter((user) => user.username === username && user.password === password)),
    );
  }

  register(user: User): Observable<User> {
    return this.http.postUser(user);
  }
}
