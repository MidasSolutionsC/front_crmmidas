import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CalendarComponent } from './calendar/calendar.component';
import { CoreModule } from '../core/core.module';
import { CallComponent } from './call/call.component';
import { SaleComponent } from './sale/sale.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SettingsModule } from './settings/settings.module';
import { AllowedIpComponent } from './allowed-ip/allowed-ip.component';


// SMART WIZARD
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ColorPickerModule } from 'ngx-color-picker';

// dropzone
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';
import { ModalRegisterComponent } from './sale/modals/modal-register/modal-register.component';
import { FormClientComponent } from './sale/forms/form-client/form-client.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { FormSaleDetailComponent } from './sale/forms/form-sale-detail/form-sale-detail.component';
import { TableSaleDetailComponent } from './sale/tables/table-sale-detail/table-sale-detail.component';
import { FormSaleDocumentComponent } from './sale/forms/form-sale-document/form-sale-document.component';
import { FormSaleHistoryComponent } from './sale/forms/form-sale-history/form-sale-history.component';
import { FormSaleCommentComponent } from './sale/forms/form-sale-comment/form-sale-comment.component';
import { TableSaleDocumentComponent } from './sale/tables/table-sale-document/table-sale-document.component';
import { TableSaleHistoryComponent } from './sale/tables/table-sale-history/table-sale-history.component';
import { TableSaleCommentComponent } from './sale/tables/table-sale-comment/table-sale-comment.component';
import { FormClientContactComponent } from './sale/forms/form-client/form-client-contact/form-client-contact.component';
import { FormClientAddressComponent } from './sale/forms/form-client/form-client-address/form-client-address.component';
import { FormClientBankAccountComponent } from './sale/forms/form-client/form-client-bank-account/form-client-bank-account.component';
import { TableClientAddressComponent } from './sale/tables/table-client-address/table-client-address.component';
import { TableClientBankAccountComponent } from './sale/tables/table-client-bank-account/table-client-bank-account.component';
import { TableClientContactComponent } from './sale/tables/table-client-contact/table-client-contact.component';
import { InfoGeneralComponent } from './sale/info/info-general/info-general.component';
import { ModalUpdateComponent } from './sale/modals/modal-update/modal-update.component';
import { ModalDetailComponent } from './sale/modals/modal-detail/modal-detail.component';
import { ModalFormComponent } from './sale/modals/modal-form/modal-form.component';
import { FormSearchClientComponent } from './sale/forms/form-client/form-search-client/form-search-client.component';
import { FormPersonComponent } from './sale/forms/form-client/form-person/form-person.component';
import { FormCompanyComponent } from './sale/forms/form-client/form-company/form-company.component';
import { FormClientFullComponent } from './sale/forms/form-client-full/form-client-full.component';
import { FormIdentificationComponent } from './sale/forms/form-client/form-identification/form-identification.component';
import { FormSaleInstallationComponent } from './sale/forms/form-sale-installation/form-sale-installation.component';
import { FormMobileComponent } from './sale/forms/form-sale-detail/form-mobile/form-mobile.component';
import { FormFixedComponent } from './sale/forms/form-sale-detail/form-fixed/form-fixed.component';
import { FormTvComponent } from './sale/forms/form-sale-detail/form-tv/form-tv.component';
import { FormSaleDetailFullComponent } from './sale/forms/form-sale-detail-full/form-sale-detail-full.component';
import { TableSaleDetailFullComponent } from './sale/tables/table-sale-detail-full/table-sale-detail-full.component';
import { FormArrayContactComponent } from './sale/forms/form-client/form-client-contact/form-array-contact/form-array-contact.component';  
import { FormComponent } from './sale/form/form.component';
import { FormArrayBankAccountComponent } from './sale/forms/form-client/form-client-bank-account/form-array-bank-account/form-array-bank-account.component'; 

import {ScrollingModule} from '@angular/cdk/scrolling';

// PRIME NG
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {VirtualScrollerModule} from 'primeng/virtualscroller'
import { SkeletonModule } from 'primeng/skeleton';
import {TabViewModule} from 'primeng/tabview'
import {PanelModule} from 'primeng/panel'

@NgModule({
  declarations: [
    CalendarComponent,
    CallComponent,
    SaleComponent,
    AllowedIpComponent,
    ModalRegisterComponent,
    FormClientComponent,
    FormSaleDetailComponent,
    TableSaleDetailComponent,
    FormSaleDocumentComponent,
    FormSaleHistoryComponent,
    FormSaleCommentComponent,
    TableSaleDocumentComponent,
    TableSaleHistoryComponent,
    TableSaleCommentComponent,
    FormClientContactComponent,
    FormClientAddressComponent,
    FormClientBankAccountComponent,
    TableClientAddressComponent,
    TableClientBankAccountComponent,
    TableClientContactComponent,
    InfoGeneralComponent,
    ModalUpdateComponent,
    ModalDetailComponent,
    ModalFormComponent,
    FormSearchClientComponent,
    FormPersonComponent,
    FormCompanyComponent,
    FormClientFullComponent,
    FormIdentificationComponent,
    FormComponent,
    FormSaleInstallationComponent,
    FormMobileComponent,
    FormFixedComponent,
    FormTvComponent,
    FormSaleDetailFullComponent,
    TableSaleDetailFullComponent,
    FormArrayContactComponent,
    FormArrayBankAccountComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    MaintenanceModule,
    TranslateModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    HttpClientModule,
    UIModule,
    WidgetModule,
    FullCalendarModule, // CALENDAR
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule,
    NgxPaginationModule,
    SettingsModule,

    // SMART WIZARD
    CKEditorModule,
    NgStepperModule,
    CdkStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    UiSwitchModule,
    ColorPickerModule,

    // dropzone
    NgxDropzoneModule,
    BsDatepickerModule,

    // Flakpicjer
    FlatpickrModule,
    // NgxDatatableModule,
    // ExportAsModule,
    // DataTablesModule
    AccordionModule,

    // PRIME NG
    ScrollPanelModule,
    VirtualScrollerModule,
    SkeletonModule,
    TabViewModule
  ],
  providers: [BsDropdownConfig, provideNgxMask()]
})
export class PagesModule { }
