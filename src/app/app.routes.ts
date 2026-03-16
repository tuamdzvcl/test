import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/ui/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { SignupComponent } from './features/auth/pages/signup/signup.component';
import { AppShellComponent } from './core/layouts/app-shell/app-shell.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { EventsComponent } from './features/events/pages/events/events.component';

export const routes: Routes = [
  {path:'header',component: Headers},
 


  {path:'auth',
  children:[
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    
  ]
},
{
  path:'admin',
  children:[
    {path:'dashboard',component:DashboardComponent },
    {path:'events',component:EventsComponent}
  ]
}
  
];
