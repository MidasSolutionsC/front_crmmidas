import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Installation } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-form-sale-installation',
  templateUrl: './form-sale-installation.component.html',
  styleUrls: ['./form-sale-installation.component.scss']
})
export class FormSaleInstallationComponent implements OnInit, OnDestroy{

  installationForm: FormGroup;
  private subscription: Subscription = new Subscription();
  
  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    
  }

  
  /**
   * ***************************************************************
   * FORM CONTROLS - INSTALACIONES
   * ***************************************************************
   */
  get f() {
    return this.installationForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const installation = new Installation();
    const formGroupData = this.getFormGroupInstallation(installation);
    this.installationForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupInstallation(model: Installation): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo: ['', [Validators.required, Validators.maxLength(50)]],
      ventas_id: ['', [Validators.nullValidator, Validators.min(1)]],
      direccion: ['', [Validators.required, Validators.maxLength(150)]],
      localidad: ['', [Validators.required, Validators.maxLength(70)]],
      provincia: ['', [Validators.required, Validators.maxLength(70)]],
      codigo_postal: ['', [Validators.required, Validators.maxLength(20)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }

}
