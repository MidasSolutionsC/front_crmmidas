import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleRoutingModule } from './sale-routing.module';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    SaleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    TranslateModule,
  ]
})
export class SaleModule { }
