import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeRoutingModule } from './type-routing.module';
import { MaintenanceModule } from '../maintenance.module';
import { TranslateModule } from '@ngx-translate/core';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaintenanceRoutingModule } from '../maintenance-routing.module';
import { ExportAsModule } from 'ngx-export-as';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CoreModule } from 'src/app/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { provideNgxMask } from 'ngx-mask';
import { TypeBankAccountComponent } from './type-bank-account/type-bank-account.component';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { TypeServiceComponent } from './type-service/type-service.component';
import { TypeStatusComponent } from './type-status/type-status.component';
import { TypeUserComponent } from './type-user/type-user.component';


@NgModule({
  declarations: [
    TypeBankAccountComponent,
    TypeDocumentComponent,
    TypeServiceComponent,
    TypeStatusComponent,
    TypeUserComponent,
  ],
  imports: [
    CommonModule,
    TypeRoutingModule,
    // MaintenanceModule
    WidgetModule,
    ReactiveFormsModule,
    FormsModule,
    UIModule,
    // ComponentsModule,
    TranslateModule,

    NgSelectModule,
    NgxPaginationModule,
    MaintenanceRoutingModule,
    ExportAsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CoreModule,
    DataTablesModule
  ],
  providers: [BsDropdownConfig, provideNgxMask()]
})
export class TypeModule { }
