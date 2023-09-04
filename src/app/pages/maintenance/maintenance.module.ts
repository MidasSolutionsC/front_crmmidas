import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { TypeStatusComponent } from './type-status/type-status.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from 'src/app/core/pipes';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { TypeBankAccountComponent } from './type-bank-account/type-bank-account.component';
import { TypeUserComponent } from './type-user/type-user.component';
import { TypeServiceComponent } from './type-service/type-service.component';
import { ManualComponent } from './manual/manual.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { CountryComponent } from './country/country.component';
import { PromotionComponent } from './promotion/promotion.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';
import { CampusComponent } from './campus/campus.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [
    TypeDocumentComponent,
    TypeStatusComponent,
    TypeBankAccountComponent,
    TypeUserComponent,
    TypeServiceComponent,
    ManualComponent,
    AdvertisementComponent,
    CountryComponent,
    PromotionComponent,
    ProductComponent,
    UserComponent,
    GroupComponent,
    CampusComponent,
  ],
  imports: [
    CommonModule,
    WidgetModule,
    ReactiveFormsModule,
    FormsModule,
    UIModule,
    ComponentsModule,
    TranslateModule,
    CKEditorModule,
    NgStepperModule,
    CdkStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    // NgxPaginationModule,
    NgxDatatableModule,
    MaintenanceRoutingModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CoreModule
  ],
  providers: [BsDropdownConfig, provideNgxMask()]
})
export class MaintenanceModule { }
