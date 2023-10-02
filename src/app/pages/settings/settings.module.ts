import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { TypeUserPermissionComponent } from './type-user-permission/type-user-permission.component';
import { PermissionComponent } from './permission/permission.component';
import { UIModule } from "../../shared/ui/ui.module";
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from 'src/app/core/pipes';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ExportAsModule } from 'ngx-export-as';
import { DataTablesModule} from 'angular-datatables';
@NgModule({
    declarations: [
        TypeUserPermissionComponent,
        PermissionComponent
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        UIModule,
        WidgetModule,
        ReactiveFormsModule,
        FormsModule,

      // ComponentsModule,
        TranslateModule,
        CKEditorModule,
        NgStepperModule,
        CdkStepperModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgSelectModule,
        NgxPaginationModule,
        NgxDatatableModule,
        SettingsRoutingModule,
        ExportAsModule,
        PaginationModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        CoreModule,
        DataTablesModule
    ]
})
export class SettingsModule { }
