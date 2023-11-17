import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorComponent } from './operator/operator.component';
import { TypificationComponent } from './typification/typification.component';

const routes: Routes = [
  {path: 'operator', component: OperatorComponent},
  {path: 'typification', component: TypificationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallRoutingModule { }
