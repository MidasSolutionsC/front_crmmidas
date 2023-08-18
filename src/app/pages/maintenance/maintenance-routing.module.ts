import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { TypeStatusComponent } from './type-status/type-status.component';

const routes: Routes = [
  {
    path: 'typeDocument',
    component: TypeDocumentComponent
  },
  {
    path: 'typeStatus',
    component: TypeStatusComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
