import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value
  }

  login(Email: string, Password: string) {
    return this.http.post<User>('api/User/login', {Email, Password})
    .pipe(map(user => {
      sessionStorage.setItem('user', JSON.stringify(user.token));
      this.userSubject.next(user);
      return user;
    }))
  }

  logout() {
    return this.http.post('api/User/logout', {})
    .pipe(map(() =>{
      sessionStorage.removeItem('user');
      this.userSubject.next(null)
    }));
  }

  register(user: User) {
    return this.http.post<User>('api/User/register', user)
    .pipe(map(user => {
      sessionStorage.setItem('user', JSON.stringify(user.token));
      this.userSubject.next(user);
      return user
    }));
  }


}
