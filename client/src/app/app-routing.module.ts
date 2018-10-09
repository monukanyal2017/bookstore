import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { ChangepasswordComponent } from './auth/forgetpassword/changepassword/changepassword.component';
import { ConfirmaccountComponent } from './auth/confirmaccount/confirmaccount.component';
import { ForgetpasswordComponent } from './auth/forgetpassword/forgetpassword.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './home/profile/profile.component';
import { CartComponent } from './home/cart/cart.component';
//import { SampleComponent } from './sample/sample.component';


const routes: Routes = [
 // { path: '', component: SampleComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword', component: ForgetpasswordComponent },
  { path: 'recoverypassword', component: ChangepasswordComponent },
  { path: 'confirm', component: ConfirmaccountComponent },
  { path: 'profile', component: ProfileComponent,canActivate:[AuthGuard] },
  { path: 'cart', component: CartComponent },
  //{ path: 'brewer', component: BrewerComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}