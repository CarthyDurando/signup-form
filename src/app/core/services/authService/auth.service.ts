import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  runFirstRequest(lastNameLength: number) : Observable<any>{
    return this.http.get(`https://jsonplaceholder.typicode.com/photos/${lastNameLength}`).pipe(
      catchError((error: any) => {
        console.error('Error occurred in runFirstRequest:', error);
        // Handle error as needed, such as displaying an error message to the user
        return of({}); // Return an empty Observable to prevent further propagation of the error
      })
    );;
  }

  runSecondRequest(user: User) : Observable<any>{
    return this.http.post(`https://jsonplaceholder.typicode.com/users`, user).pipe(
      catchError((error: any) => {
        console.error('Error occurred in runSecondRequest:', error);
        return of({}); 
      })
    );;
  }
}
