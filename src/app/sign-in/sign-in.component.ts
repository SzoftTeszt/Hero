import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email=""
  password=""
  error=false
  errorText=""
  sendReset=false
  constructor(private auth:AuthService, private router:Router){}

  googleAuth(){
    this.auth.googleAuth()
  }

  forgotMail(){
    this.auth.forgotMail(this.email).then(
      ()=>{
        this.error=false
        this.sendReset=true
      }
    )
  }

  signIn(){
    this.auth.signInEmailPassword(this.email, this.password)
    .then( ()=> this.router.navigate(['/herolist']))
    .catch( (err)=>{
      this.error=true
      this.errorText=err
    })
  }
}
