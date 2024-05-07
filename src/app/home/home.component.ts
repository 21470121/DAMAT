import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private toastr: ToastrService){}

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
