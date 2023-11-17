import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    ComponentsModule
  ],
})

export class SharedModule { }
