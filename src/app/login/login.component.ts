import { Component, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account_service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  hide = true;
  model: any = {}
 
  constructor(private router: Router,private accountService: AccountService) {}

  ngOnInit(): void {
      
  }


  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
       
        this.router.navigateByUrl('/');
      },
      error: error => console.log(error)
    })
  }

  
}
