import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // apiUrl="http://127.0.0.1:5001/heroauth-97aa7/us-central1/api/"
  apiUrl="https://api-k5liq7euna-uc.a.run.app/"

  loggedUser:any={}
  
  constructor(private afAuth:AngularFireAuth, private http:HttpClient) {
      this.afAuth.authState.subscribe(
        (user)=>{
            if (user){
              user.getIdToken().then(
                (token)=> {
                  console.log("Tokern:", token)
                  this.loggedUser=user
                  this.loggedUser.token=token
                  console.log("Logged User", this.loggedUser)
                }
              )
            }
            else this.loggedUser=null

        }
      )
   }

  getUsers(){
    const headers= new HttpHeaders().set('Authorization', this.loggedUser.token)
    this.http.get(this.apiUrl+"users",{headers}).subscribe(
      (users)=>console.log("Users", users)
    )
  }

  googleAuth(){
    this.afAuth.signInWithPopup(new GoogleAuthProvider())
    .then(
      ()=>console.log("Sikeres Google Auth")
    )
    .catch(
      (error)=>console.log("Googe Auth hiba! ", error)
    )
  }


  signOut(){
    this.afAuth.signOut().then(
      ()=>console.log("Kiléptél!")
    )
    .catch(
      ()=>console.log("Még kilépni se tudsz!")
    )
  }
}
