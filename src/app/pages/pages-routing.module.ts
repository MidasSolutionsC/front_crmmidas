import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { MainComponent } from './main/main/main.component';
import { jwtAuthGuard, hasRoleGuard } from '../core/guards';
import { CalendarComponent } from './calendar/calendar.component';
import { CallComponent } from './call/call.component';
import { SaleComponent } from './sale/sale.component';
import { AllowedIpComponent } from './allowed-ip/allowed-ip.component';

import {FormComponent } from './sale/form/form.component';


const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: MainComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'main', component: MainComponent },
  { path: 'mains', loadChildren: () => import('./main/main.module').then(m => m.MainModule), canActivate: [hasRoleGuard] },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule), canActivate: [hasRoleGuard] },
  { path: 'maintenances', loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule), canActivate: [hasRoleGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [hasRoleGuard] },
  { path: 'call', component: CallComponent, canActivate: [hasRoleGuard] },
  { path: 'sale', loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule), canActivate: [hasRoleGuard] },
  // { path: 'sale', component: FormComponent, canActivate: [hasRoleGuard] },
  { path: 'allowed-ip', component: AllowedIpComponent, canActivate: [hasRoleGuard] },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), canActivate: [hasRoleGuard] },
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule), canActivate: [hasRoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
