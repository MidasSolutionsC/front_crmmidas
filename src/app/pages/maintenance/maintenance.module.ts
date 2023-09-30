import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from 'src/app/core/pipes';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
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
import { ModalDetailComponent } from './group/modals/modal-detail/modal-detail.component';
import { ExportAsModule } from 'ngx-export-as';
import { DataTablesModule} from 'angular-datatables';
import { BrandComponent } from './brand/brand.component';
import { ServiceComponent } from './service/service.component';
import { CategoryComponent } from './category/category.component';
import { TypeCurrencyComponent } from './type-currency/type-currency.component'

@NgModule({
  declarations: [
    ManualComponent,
    AdvertisementComponent,
    CountryComponent,
    PromotionComponent,
    ProductComponent,
    UserComponent,
    GroupComponent,
    CampusComponent,
    ModalDetailComponent,
    BrandComponent,
    ServiceComponent,
    CategoryComponent,
    TypeCurrencyComponent,
    
  ],
  imports: [
    CommonModule,
    WidgetModule,
    ReactiveFormsModule,
    FormsModule,
    UIModule,
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
    MaintenanceRoutingModule,
    ExportAsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CoreModule,
    DataTablesModule,
    // Acordeón
    
  ],
  providers: [BsDropdownConfig, provideNgxMask()]
})
export class MaintenanceModule { }
