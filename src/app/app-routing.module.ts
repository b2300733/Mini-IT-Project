import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './components/jobs/jobs.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CommunitymarketComponent } from './components/communitymarket/communitymarket.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { ProductpageComponent } from './components/productpage/productpage.component';
import { AuthCallbackComponent } from '../../backend/auth-callback.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ShoppageComponent } from './components/shoppage/shoppage.component';
import { ShopproductpageComponent } from './components/shopproductpage/shopproductpage.component';
import { CartComponent } from './components/cart/cart.component';
import { ForumComponent } from './components/forum/forum.component';
import { EditproductComponent } from './components/editproduct/editproduct.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { TacComponent } from './components/tac/tac.component';

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
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'product',
    component: ProductpageComponent,
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
  },
  {
    path: 'market',
    component: CommunitymarketComponent,
  },
  {
    path: 'products',
    component: ShoppageComponent,
  },
  {
    path: 'shop-product',
    component: ShopproductpageComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'forum',
    component: ForumComponent,
  },
  {
    path: 'edit-product',
    component: EditproductComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'tac',
    component: TacComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
