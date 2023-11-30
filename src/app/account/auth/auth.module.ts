import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';

import { SignupComponent } from './signup/signup.component';

import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    AlertModule.forRoot(),
    UIModule,
    AuthRoutingModule,
    CoreModule
  ]
})
export class AuthModule { }
