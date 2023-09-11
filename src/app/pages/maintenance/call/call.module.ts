import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallRoutingModule } from './call-routing.module';
import { OperatorComponent } from './operator/operator.component';
import { TypificationComponent } from './typification/typification.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaintenanceRoutingModule } from '../maintenance-routing.module';
import { ExportAsModule } from 'ngx-export-as';


@NgModule({
  declarations: [
    OperatorComponent,
    TypificationComponent
  ],
  imports: [
    CommonModule,
    CallRoutingModule,

    WidgetModule,
    ReactiveFormsModule,
    FormsModule,
    UIModule,
    TranslateModule,
    CKEditorModule,
    NgStepperModule,
    CdkStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    NgxPaginationModule,
    NgxDatatableModule,
    MaintenanceRoutingModule,
    ExportAsModule,
  ]
})
export class CallModule { }
