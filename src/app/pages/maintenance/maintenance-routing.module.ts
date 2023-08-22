import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { TypeStatusComponent } from './type-status/type-status.component';
import { TypeBankAccountComponent } from './type-bank-account/type-bank-account.component';
import { TypeUserComponent } from './type-user/type-user.component';
import { TypeServiceComponent } from './type-service/type-service.component';

const routes: Routes = [
  {
    path: 'typeDocument',
    component: TypeDocumentComponent
  },
  {
    path: 'typeStatus',
    component: TypeStatusComponent
  },
  {
    path: 'typeBankAccount',
    component: TypeBankAccountComponent
  },
  {
    path: 'typeUser',
    component: TypeUserComponent
  },
  {
    path: 'typeService',
    component: TypeServiceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
