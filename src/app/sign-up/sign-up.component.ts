import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  password=""
  confirmPassword=""
  email=""

  constructor(private auth:AuthService, private router:Router){}

  googleAuth(){
    this.auth.googleAuth()
  }

  signUpEmailPassword(){
    this.auth.signUpEmailPassword(this.email, this.password)
    .then(
      ()=>{
        this.auth.verifyEmail().then(
          ()=>{
            this.auth.signOut()
            this.router.navigate(['/verifymail'])
         }
        )
      }
    ).catch(
      (err)=>{console.log(err)}
    )
  }
}
