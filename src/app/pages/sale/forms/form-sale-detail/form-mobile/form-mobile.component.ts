import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetailMobileLine } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-form-mobile',
  templateUrl: './form-mobile.component.html',
  styleUrls: ['./form-mobile.component.scss']
})
export class FormMobileComponent implements OnInit, OnDestroy{

  // FORM LINEA MOVIL
  mobileLineForm: FormGroup;

  differentHolder: boolean = false;
  terminal: boolean = false;
  
  constructor(
    private cdr: ChangeDetectorRef,
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
   * ***********************************************
   * OBTENER EL FORM CONTROL - LINEA MOVIL
   * ***********************************************
   */
  get fm() {
    return this.mobileLineForm.controls;
  }

  /**
   * INICIAR FORMULARIO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: DetailMobileLine = new DetailMobileLine()){
    const formGroupData = this.getFormGroupDataMobile(model);
    this.mobileLineForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORM GROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataMobile(model: DetailMobileLine): object {
    return {
      tipo_documento_id: [model?.tipo_documento_id || '', [Validators.required, Validators.min(1)]],
      documento_titular: [model?.documento_titular || '', [Validators.required, Validators.maxLength(11)]],
      titular: [model?.titular || '', [Validators.required, Validators.maxLength(50)]],
      operador_donante_id: [model?.operador_donante_id || '', [Validators.nullValidator, Validators.min(1)]],
      num_portar: [model?.num_portar || '', [Validators.nullValidator, Validators.maxLength(50)]],
      icc: [model?.icc || '', [Validators.nullValidator, Validators.maxLength(50)]],
      terminal: [model?.terminal || false, [Validators.nullValidator]],
      diferente_titular: [false, [Validators.nullValidator]],
      modelo_terminal: [model?.modelo_terminal || '', [Validators.nullValidator, Validators.maxLength(150)]],
      aop: [model?.aop || 'Alta', [Validators.nullValidator, Validators.maxLength(60)]],
    }
  }


}
