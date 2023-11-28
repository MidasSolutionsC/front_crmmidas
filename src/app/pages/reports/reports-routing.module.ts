import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ByCommercialComponent } from './by-commercial/by-commercial.component';
import { AllComponent } from './all/all.component';
import { ByCoordinatorComponent } from './by-coordinator/by-coordinator.component';

const routes: Routes = [
  {
    path: 'all',
    component: AllComponent
  },
  {
    path: 'by_commercial',
    component: ByCommercialComponent
  },
  {
    path: 'by_coordinator',
    component: ByCoordinatorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
