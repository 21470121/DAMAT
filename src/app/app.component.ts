import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from '../_services/account_service';
import { User } from '../_models/User';
import { HomeComponent } from './home/home.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, CommonModule, NavComponent, MatToolbarModule, MatButtonModule, MatIconModule, RouterOutlet, RouterLink, CommonModule, MatMenuModule, MatSidenavModule, MatFormFieldModule,FormsModule, ReactiveFormsModule,MatButtonModule
      ,MatInputModule, MatCheckboxModule, MatListModule, HomeComponent]
})
export class AppComponent implements OnInit{

  showNavbar: boolean = true;
  showSidebar: boolean = false;
  title = 'EmberSystem';
  users:any;
  
  constructor(private http: HttpClient, private accountService: AccountService, private router : Router) {
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showNavbar = !['/login'].includes(event.url);
        this.showSidebar = localStorage.getItem('role') === 'Admin';
      }
    });
    
  }
  ngOnInit(): void {
    console.log(this.showSidebar);
   this.getUser();
   this.setCurrentUser();
  }

  getUser(){
    this.http.get('https://localhost:7049/api/Account/GetAllAccounts').subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('Request complete')
     })
  }
  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user:User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
  
}
