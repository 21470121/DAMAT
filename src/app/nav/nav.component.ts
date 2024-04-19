import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterOutlet,RouterLink, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../_services/account_service';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import { RegisterComponent } from '../Customer/register/register.component';
import { Observable, Subscription, of } from 'rxjs';
import { User } from '../../_models/User';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterOutlet, RouterLink, CommonModule, MatMenuModule, MatSidenavModule, MatFormFieldModule,FormsModule, ReactiveFormsModule,MatButtonModule
    ,MatInputModule, MatCheckboxModule, MatListModule, RegisterComponent
   ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  showNavbar: boolean = true;
  isAdmin = false;

   options: any;
  
  constructor(private route: ActivatedRoute, public accountservice: AccountService, private router: Router) { 
    
  }

  
  ngOnInit() {
    this.isAdmin = localStorage.getItem('role') === 'Admin';
  }

  logout() {
    this.accountservice.logout();
    this.router.navigateByUrl('/');
    this.isAdmin = false; 
    window.location.reload(); // ensure that the logging out clears the state of the sidenav
  }

}

