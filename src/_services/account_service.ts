import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/User';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'https://localhost:7049/api/';
  //behaviour subject 
  private CurrentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.CurrentUserSource.asObservable();
//$: indicates is observable
  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User)=> {
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user))
          const helper = new JwtHelperService()
          const decodedToken = helper.decodeToken(user.token)
          localStorage.setItem('role', decodedToken['role'])
          console.log(decodedToken)
          this.CurrentUserSource.next(user)
        }
      })
    )
     //going to the account controller and the login endpoint with the model data
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.CurrentUserSource.next(user);
      })
    )
  }

  setCurrentUser(user: User){
    this.CurrentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.CurrentUserSource.next(null);
  }
}
