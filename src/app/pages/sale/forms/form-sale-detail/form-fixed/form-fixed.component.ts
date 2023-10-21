import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetailFixedLine } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, OperatorService, SweetAlertService, TempInstallationService, TypeDocumentService, TypeStatusService } from 'src/app/core/services';

@Component({
  selector: 'app-form-fixed',
  templateUrl: './form-fixed.component.html',
  styleUrls: ['./form-fixed.component.scss']
})
export class FormFixedComponent implements OnInit, OnDestroy {

  // FORM LINEA FIJA
  fixedLineForm: FormGroup;


  constructor(
    private cdr: ChangeDetectorRef,
    private _tempInstallationService: TempInstallationService,
    private _operatorService: OperatorService,
    private _typeStatusService: TypeStatusService,
    private _typeDocumentService: TypeDocumentService,
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
   * OBTENER EL FORM CONTROL - LINEA FIJA
   * ***********************************************
   */
  get fx() {
    return this.fixedLineForm.controls;
  }

  /**
   * INICIAR FORMULARIO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: DetailFixedLine = new DetailFixedLine()){
    const formGroupData = this.getFormGroupDataFixed(model);
    this.fixedLineForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORM GROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataFixed(model: DetailFixedLine): object {
    return {
      tipo_documentos_id: [model?.tipo_documentos_id || '', [Validators.required, Validators.min(1)]],
      documento_titular: [model?.documento_titular || '', [Validators.required, Validators.maxLength(11)]],
      titular: [model?.titular || '', [Validators.required, Validators.maxLength(50)]],
      operador_donante_id: [model?.operador_donante_id || '', [Validators.nullValidator, Validators.min(1)]],
      num_portar: [model?.num_portar || '', [Validators.nullValidator, Validators.maxLength(50)]],
      aop: [model?.aop || '', [Validators.nullValidator, Validators.maxLength(60)]],
    }
  }

}
