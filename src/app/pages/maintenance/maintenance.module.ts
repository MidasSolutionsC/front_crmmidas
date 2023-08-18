import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { TypeStatusComponent } from './type-status/type-status.component';


@NgModule({
  declarations: [
    TypeDocumentComponent,
    TypeStatusComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [BsDropdownConfig]
})
export class MaintenanceModule { }
