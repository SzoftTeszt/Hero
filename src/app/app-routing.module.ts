import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HeroContactComponent } from './hero-contact/hero-contact.component';
import { UsersComponent } from './users/users.component';
import { VerifymailComponent } from './verifymail/verifymail.component';

const routes: Routes = [
  {path:"signin", component:SignInComponent},
  {path:"signup", component:SignUpComponent},
  {path:"herolist", component:HeroContactComponent},
  {path:"users", component:UsersComponent},
  {path:"verifymail", component:VerifymailComponent},
  {path:"", redirectTo:"/herolist", pathMatch:"full"},
  {path:"**", redirectTo:"/herolist", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
