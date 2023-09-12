import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from './pipes/replace-attribute.pipe';
import { SortDirective } from './directives/table/sort.directive';
import { TrimInputDirective } from './directives/form/trim-input.directive';

@NgModule({
  declarations: [
    ReplaceAttributePipe,
    SortDirective,
    TrimInputDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ReplaceAttributePipe,
    TrimInputDirective
  ]
})
export class CoreModule { }
