import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hero';

  constructor(private auth:AuthService){}

  googleAuth(){
    this.auth.googleAuth()
  }
  signOut(){
    this.auth.signOut()
  }
  getUsers(){
    this.auth.getUsers()
  }
}
