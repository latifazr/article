import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthguardGuard } from './guards/authguard.guard';

const routes: Routes = [{ path: 'login', component: LoginComponent }, 
{ path: 'register', component: RegisterComponent }, 
{ path: 'home', component: HomeComponent,canActivate: [AuthguardGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
