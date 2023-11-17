import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from './pipes/replace-attribute.pipe';
import { SortDirective } from './directives/table/sort.directive';
import { TrimInputDirective } from './directives/form/trim-input.directive';
import { FocusDirective } from './directives/form/focus.directive';

@NgModule({
  declarations: [
    ReplaceAttributePipe,
    SortDirective,
    TrimInputDirective,
    FocusDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ReplaceAttributePipe,
    TrimInputDirective,
    FocusDirective
  ]
})
export class CoreModule { }
