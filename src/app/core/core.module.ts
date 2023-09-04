import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from './pipes/replace-attribute.pipe';
import { SortDirective } from './directives/table/sort.directive';

@NgModule({
  declarations: [
    ReplaceAttributePipe,
    SortDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ReplaceAttributePipe
  ]
})
export class CoreModule { }
