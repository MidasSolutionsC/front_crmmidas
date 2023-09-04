import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { MainComponent } from './main/main/main.component';
import { jwtAuthGuard } from '../core/guards';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: MainComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'main', component: MainComponent },
  { path: 'mains', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'maintenances', loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
