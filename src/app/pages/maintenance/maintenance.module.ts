import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { TypeDocumentComponent } from './type-document/type-document.component';


@NgModule({
  declarations: [
    TypeDocumentComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [BsDropdownConfig]
})
export class MaintenanceModule { }
