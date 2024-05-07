import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { User } from '../_models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SocialAuthService} from '@abacritt/angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

   
  
  baseUrl = 'http://localhost:5240/api/';
  //behaviour subject 
  private CurrentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.CurrentUserSource.asObservable();

//$: indicates is observable
  constructor(private http: HttpClient, private externalAuthService: SocialAuthService) { 
    //this.externalAuthService.authState.subscribe((user) => {
      //console.log(user)
     /// this.extAuthChangeSub.next(user);
    //})
  }
  
 

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/Login', model).pipe(
      map((response: any)=> {
        if(response.requiresTwoFactorAuth){
          return { requiresTwoFactorAuth: true };
        } else {
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user))
          const helper = new JwtHelperService()
          const decodedToken = helper.decodeToken(user.token)
        const role_claim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        const role = decodedToken[role_claim]
          localStorage.setItem('role', role)
          console.log(role)
          this.CurrentUserSource.next(user)
        }
      } 
      return response; 
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

  externalLogin(idToken: string){
    const headers = new HttpHeaders({ 'Content-Type': 'text/json' });
    const requestBody = `"${idToken}"`;

    return this.http.post<User>(this.baseUrl+ 'account/LoginExternal',requestBody, {headers: headers}).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          if(user.TwoFA)
          localStorage.setItem('user', JSON.stringify(user));
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(user.token);
          const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
          const role = decodedToken[roleClaim];
          localStorage.setItem('role', role);
          console.log(role);
          
          this.CurrentUserSource.next(user);
        }
      })
    );
  }


  
  externallogin1(idToken: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'text/json' });

    // Construct the request body with the ID token as a JSON string
    const requestBody = `"${idToken}"`;
    return this.http.post<User>(this.baseUrl + 'account/LoginExternal',requestBody, {headers: headers}).pipe(
      map((response: User)=> {
        const user = response;
        console.log(user);
      })
    );
  }

  Verify2FA(verifytoken: string, username: string){
    return this.http.get<User>(this.baseUrl + 'account/Verify2FAToken',{ params: { verifytoken, username } }).pipe(
        map((response: User) => {
          const user = response;
          if (user) {
            
            localStorage.setItem('user', JSON.stringify(user));
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(user.token);
            const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
            const role = decodedToken[roleClaim];
            localStorage.setItem('role', role);
            console.log(role);
            this.CurrentUserSource.next(user);
          }
        })
    );
  }
  
}
