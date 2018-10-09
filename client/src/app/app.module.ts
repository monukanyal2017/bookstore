import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ConfirmaccountComponent } from './auth/confirmaccount/confirmaccount.component';
import { ChangepasswordComponent } from './auth/forgetpassword/changepassword/changepassword.component';
import { ForgetpasswordComponent } from './auth/forgetpassword/forgetpassword.component';
import { HomeComponent } from './home/home.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SampleComponent } from './sample/sample.component';
import { Dialogbox } from './shared/dialogbox/dialog.component';
import { BookService } from './shared/services/book.service';
import { ProfileComponent } from './home/profile/profile.component';
import { BookcardComponent } from './shared/cards/bookcard/bookcard.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { CartComponent } from './home/cart/cart.component';
import { CartService } from './shared/services/cart.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PayService } from './shared/services/pay.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SampleComponent,
    Dialogbox,
    ForgetpasswordComponent,
    ChangepasswordComponent,
    ConfirmaccountComponent,
    HomeComponent,
    HeaderComponent,
    SidenavListComponent,
    ProfileComponent,
    BookcardComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule

  ],
  entryComponents: [Dialogbox],
  providers: [
    AuthService,
    BookService,
    CartService,
    PayService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
