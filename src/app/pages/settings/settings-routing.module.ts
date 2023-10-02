import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeUserPermissionComponent } from './type-user-permission/type-user-permission.component';
import { PermissionComponent } from './permission/permission.component';
const routes: Routes = [
  {
    path: 'type_user_permission',
    component: TypeUserPermissionComponent
  },
  {
    path: 'permission',
    component: PermissionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
