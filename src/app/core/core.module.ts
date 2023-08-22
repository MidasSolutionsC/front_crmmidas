import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from './pipes/replace-attribute.pipe';

@NgModule({
  declarations: [
    ReplaceAttributePipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ReplaceAttributePipe
  ]
})
export class CoreModule { }
