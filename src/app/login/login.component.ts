import { Component, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { AccountService } from '../../_services/account_service';
import { Router } from '@angular/router';
import {GoogleSigninButtonModule, SocialAuthService} from '@abacritt/angularx-social-login';
import { LoginDialogComponent } from './login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {merge} from 'rxjs';
import {MatDividerModule} from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDividerModule,FormsModule, ReactiveFormsModule,CommonModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, MatCardModule, GoogleSigninButtonModule, MatButtonModule, LoginDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = '';
  token:string='';
  TwoFA: boolean=false;
  hide = true;
  model: any = {}
  showError: boolean=true;
  iDToken: string = '';
 
  constructor(private toastr: ToastrService,private router: Router,private accountService: AccountService, private externalAuthService: SocialAuthService, public dialog: MatDialog) {
    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    this.TwoFA=false;
    this.externalAuthService.authState.subscribe((user) => {
      console.log(user)
      if(user)
        {
          this.iDToken = user.idToken.toString();
          console.log(this.iDToken);
          this.externalLogin();
        } else{
          console.log('Nope');
        }
    });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }


  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        if (response?.requiresTwoFactorAuth) {
          
          const dialogRef = this.dialog.open(LoginDialogComponent, {
            data: { token: this.token },
          });
  
          dialogRef.afterClosed().subscribe(result => {
            console.log(this.model.username);
            this.verifyTwoFactorAuthToken(result, this.model.username);
          });
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: error => {
        console.error(error);
        this.toastr.success(error.name);
      }
    });
  }

  externalLogin() {
    console.log(this.iDToken);
    this.accountService.externalLogin(this.iDToken).subscribe({
      next: response => {
        console.log(response);
        this.router.navigateByUrl('/');
      },
      error: error => {
        console.log(error) ;
        this.toastr.error('Account not found :(');
      }
    });
  }


 // externalLogin = () => {
  // this.showError = false;
    
  //  this.accountService.extAuthChanged.subscribe(user =>{
  //    const externalAuth: ExternalAuth ={
  //      provider: user.provider,
  //      idToken: user.idToken
  //    }
   //   this.validateExternalAuth(externalAuth);
  //    console.log(user)
  //  })
  //}
  

  // validateExternalAuth(externalAuth: ExternalAuth) {
   // this.accountService.externalLogin(externalAuth)
    //  .subscribe({
    //    next: () => {
    //      this.router.navigateByUrl('/');
     // },
     //   error: (err: HttpErrorResponse) => {
     //     this.errorMessage = err.message;
      //    this.showError = true;
      ///    //this.accountService.signOutExternal();
      //  }
     // });
  //}

  verifyTwoFactorAuthToken(verifytoken: string, username: string) {
    this.accountService.Verify2FA(verifytoken, username).subscribe({
      next: response => {
        console.log(response);
       this.router.navigateByUrl('/');
      },
      error: error => {
        console.error(error);
        this.toastr.error('Token is incorrect!');
      }
    });
  }

}
