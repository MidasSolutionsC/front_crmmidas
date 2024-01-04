import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaceAttributePipe } from './pipes/replace-attribute.pipe';
import { SortDirective } from './directives/table/sort.directive';
import { TrimInputDirective } from './directives/form/trim-input.directive';
import { FocusDirective } from './directives/form/focus.directive';
import { ScrollListenerDirective } from './directives/scroll-listener.directive';
import { AutoScrollDirective } from './directives/auto-scroll.directive';

@NgModule({
  declarations: [
    ReplaceAttributePipe,
    SortDirective,
    TrimInputDirective,
    FocusDirective,
    ScrollListenerDirective,
    AutoScrollDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ReplaceAttributePipe,
    TrimInputDirective,
    FocusDirective,
    ScrollListenerDirective,
    AutoScrollDirective
  ]
})
export class CoreModule { }
