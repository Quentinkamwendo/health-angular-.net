import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, map} from "rxjs"
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<User>('api/account/login', {email, password})
    .pipe(map(user => {
      sessionStorage.setItem('user', JSON.stringify(user.access_token));
      this.userSubject.next(user);
      return user;
    }));
  }

  logout() {
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User) {
    return this.http.post('api/account/register', user);
  }

  getAll() {
    return this.http.get<User[]>('api/users');
  }

  getById(id: string) {
    return this.http.get<User[]>(`api/users/${id}`);
  }

  update(id: string, params: any) {
    return this.http.put(`api/users/${id}`, params)
    .pipe(map(x => {
      if (id == this.userValue?.id) {
        const user = {...this.userValue, ...params};
        sessionStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user);
      }
      return x;
    }));
  }

  delete(id: string) {
    return this.http.delete(`api/users/${id}`)
    .pipe(map(x => {
      if (id == this.userValue?.id) {
        this.logout
      }
      return x;
    }))
  }
}
