import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { SaleComponent } from './sale.component';

const routes: Routes = [
  {
    path: '',
    component: SaleComponent
  },
  {
    path: 'form',
    component: FormComponent
  },
  {
    path: 'list',
    component: ListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }
