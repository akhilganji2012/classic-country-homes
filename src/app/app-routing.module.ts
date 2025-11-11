import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Gallery } from './pages/gallery/gallery';
import { Home } from './pages/home/home';
import { Registration } from './pages/registration/registration';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { EventCreate } from './pages/event-create/event-create';
import { AuthGuard } from '../auth.guard';
import { RoleGuard } from '../role.guard';
import { Docs } from './pages/docs/docs';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Registration},
  { path: 'login', component: Login },
  {path: 'docs',
  component: Docs,
  canActivate: [AuthGuard]},
  { path: 'gallery',
  component: Gallery,
  canActivate: [AuthGuard]
  // canActivate: [RoleGuard]
  // ,data: { role: 'admin' }
  },
  { path: 'admin', component: AdminDashboard , canActivate: [RoleGuard], data: { role: 'admin' } },
  { path: 'create-event', component: EventCreate , canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
