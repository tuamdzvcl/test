import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/ui/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { SignupComponent } from './features/auth/pages/signup/signup.component';
import { AppShellComponent } from './core/layouts/app-shell/app-shell.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { EventsComponent } from './features/events/pages/events/events.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { EventsPageComponent } from './features/events/pages/events-page/events-page.component';
import { EventCardComponent } from './shared/components/event-card/event-card.component';
import { EventsGridComponent } from './features/events/components/events-grid/events-grid.component';
import { UserDropdownComponent } from './shared/components/user-dropdown/user-dropdown.component';
import { CreateEventComponent } from './shared/pages/create-event/create-event.component';

export const routes: Routes = [
  {path:'header',component: HeaderComponent},
  {
  path:'create-event',component:CreateEventComponent
},
 
{
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'event',
        component: EventsPageComponent
      }
    ]
  },
  {
    path:'admin',
    children:[
      {path:'dashboard',component:DashboardComponent}
    ]
  },
  {
    path:'userdown',component:UserDropdownComponent
  },
  {
    path:'eventcard',component:EventCardComponent
  },
  {path:'eventgrid',component:EventsGridComponent},

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
