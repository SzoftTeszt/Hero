import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // apiUrl="http://127.0.0.1:5001/heroauth-97aa7/us-central1/api/"
  apiUrl="https://api-k5liq7euna-uc.a.run.app/"

  private userSub = new Subject()
  private loggedUser:any={}
  
  constructor(private afAuth:AngularFireAuth, private http:HttpClient) {
      this.afAuth.authState.subscribe(
        (user:any)=>{
            if (user){
           
              this.loggedUser=user._delegate
              this.userSub.next(this.loggedUser)
              // console.log("Logged Userat", this.loggedUser)
              // user.getIdToken().then(
              //   (token:any)=> {
              //     console.log("Tokern:", token)
              //     this.loggedUser=user._delegate
              //     // this.loggedUser.token=token
              //     // console.log("Logged Userat", this.loggedUser.accessToken)
              //     // console.log("Logged Usert", this.loggedUser.token)
              //   }
              // )
            }
            else {
              this.loggedUser=null
              this.userSub.next(this.loggedUser)
            }

        }
      )
   }

  getLoggedUser(){
    return this.userSub
  } 

  getUsers(){
    const headers= new HttpHeaders().set('Authorization', this.loggedUser.accessToken)
    console.log(headers)
    return this.http.get(this.apiUrl+"users-with-claims",{headers})
  }
  setCustomClaims(uid:any, claims:any){
    const headers= new HttpHeaders().set('Authorization', this.loggedUser.accessToken)
    const claimsok={

      user:true,
      admin:true,
      sadmin:false
    }
    const body={
      uid:uid,
      claims:claimsok
    }
    this.http.post(this.apiUrl+"setCustomClaims",body, {headers}).subscribe(
      {
        next:  ()=>console.log("A jogkör beállítása sikeres!"),
        error: (err)=> console.log("Jogkör beállítás sikertelen", err)
      }
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

  signUpEmailPassword(email:any, password:any){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  async verifyEmail(){    
    let user= await this.afAuth.currentUser
    if (user) user.sendEmailVerification()
  }

  signInEmailPassword(email:any,password:any){
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }

  forgotMail(email:any){
    return this.afAuth.sendPasswordResetEmail(email)
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
