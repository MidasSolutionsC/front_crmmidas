import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
import { AllComponent } from './all/all.component';
import { ByCommercialComponent } from './by-commercial/by-commercial.component';
import { ByCoordinatorComponent } from './by-coordinator/by-coordinator.component';


@NgModule({
  declarations: [
    AllComponent,
    ByCommercialComponent,
    ByCoordinatorComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ReportsModule { }
