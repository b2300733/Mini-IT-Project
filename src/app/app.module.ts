import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  LucideAngularModule,
  Search,
  ShoppingCart,
  CircleUserRound,
  ChevronLeft,
} from 'lucide-angular';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CommunitymarketComponent } from './components/communitymarket/communitymarket.component';
import { SignupComponent } from './components/signup/signup.component';

import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    BannerComponent,
    JobsComponent,
    HomeComponent,
    LoginComponent,
    CommunitymarketComponent,
    SignupComponent,

    ForgotpasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LucideAngularModule.pick({
      Search,
      ShoppingCart,
      CircleUserRound,
      ChevronLeft,
    }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
