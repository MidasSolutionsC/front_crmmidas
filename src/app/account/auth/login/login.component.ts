import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ApiErrorFormattingService, FormService, LanguageService, SweetAlertService } from 'src/app/core/services';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ResponseApi } from 'src/app/core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: UntypedFormGroup;
  submitted: boolean = false;
  error: string = '';
  returnUrl: string;
  showPassword: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  private subscription: Subscription = new Subscription();

  // tslint:disable-next-line: max-line-length
  constructor(
    public languageService: LanguageService,
    private formBuilder: FormBuilder,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,) {
    this.languageService.setLanguage('es');
  }

  ngOnInit() {
    this.initForm();
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  public login(data: any) {
    this._sweetAlertService.loadingUp('Validando credencial')
    this._authService.login(data).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        const result = response.data;
        if (result?.login) {
          //this.router.navigate(['/main']);
          window.location.href = '/main'
        } else {
          this._sweetAlertService.showTopEnd({ type: 'error', title: 'Validación de credencial', message: result?.message });
        }
      }

      if (response.code == 422) {
        if (response.errors) {
          const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.message, message: textErrors });
        }
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  /**
 * INICIAR FORMULARIO CON LAS VALIDACIONES
 * 
 */
  private initForm() {
    const formGroupData = this.getFormGroupData();
    this.loginForm = this.formBuilder.group(formGroupData);
  }

  private getFormGroupData(): object {
    return {
      nombre_usuario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[^\s]+$/)]],
      clave: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
    }
  }



  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
    } else {
      const values: any = this.loginForm.value;
      this.login(values);
    }
  }

  /**
   * Mostrar/Ocultar contraseña
   */
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
