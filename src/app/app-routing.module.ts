import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'welcome', loadChildren: './welcome/welcome.module#WelcomePageModule' },
  { path: 'timeline',
      children:[
        {
          path:'',
          loadChildren:'./timeline/timeline.module#TimelinePageModule'
        },
        {
          path:':timelineId',
          loadChildren:'./timeline/timeline-detail/timeline-detail.module#TimelineDetailPageModule'
        }
      ]},
  { path: 'form', loadChildren: './form/form.module#FormPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'newevent', loadChildren: './newevent/newevent.module#NeweventPageModule' },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'myevents', loadChildren: './myevents/myevents.module#MyeventsPageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
