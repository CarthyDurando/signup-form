import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.interface';
import { Album } from '../../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  runFirstRequest(lastNameLength: number) : Observable<any>{
    return this.http.get(`https://jsonplaceholder.typicode.com/photos/${lastNameLength}`);
  }

  runSecondRequest(user: User) : Observable<any>{
    return this.http.post(`https://jsonplaceholder.typicode.com/users`, user);
  }
}
