import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [PagetitleComponent,  LoaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  exports: [PagetitleComponent, LoaderComponent]
})
export class UIModule { }
