import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './components/jobs/jobs.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CommunitymarketComponent } from './components/communitymarket/communitymarket.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { AuthCallbackComponent } from '../../backend/auth-callback.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'jobs',
    component: JobsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'forgotpassword',
    component: ForgotpasswordComponent,
  },
  {
    path: 'market',
    component: CommunitymarketComponent,
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
