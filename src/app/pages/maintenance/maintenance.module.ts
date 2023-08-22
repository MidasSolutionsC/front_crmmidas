import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule,BsDropdownConfig} from 'ngx-bootstrap/dropdown';

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


@NgModule({
  declarations: [
    TypeDocumentComponent,
    TypeStatusComponent,
    TypeBankAccountComponent,
  ],
  imports: [
    CommonModule,
    WidgetModule,
    ReactiveFormsModule,
    FormsModule,
    UIModule,
    ComponentsModule,
    TranslateModule,
    MaintenanceRoutingModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CoreModule
  ],
  providers: [BsDropdownConfig]
})
export class MaintenanceModule { }
