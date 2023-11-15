import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { Company, DetailFixedLine, OperatorList, Person, TypeDocumentList } from 'src/app/core/models';
import { Client } from 'src/app/core/models/api/client.model';
import { ApiErrorFormattingService, FormService, OperatorService, SharedClientService, SweetAlertService, TempInstallationService, TypeDocumentService, TypeStatusService } from 'src/app/core/services';

@Component({
  selector: 'app-form-fixed',
  templateUrl: './form-fixed.component.html',
  styleUrls: ['./form-fixed.component.scss']
})
export class FormFixedComponent implements OnInit, OnDestroy {
  
  @Input() submitted: Boolean = false;
  @Input() listOperators?: OperatorList[] = [];
  @Input() listTypeDocuments?: TypeDocumentList[] = [];

  isNewData: boolean = true;
  // FORM LINEA FIJA
  fixedLineForm: FormGroup;

  differentHolder: boolean = false;
  aop: string = 'Alta';
  terminal: boolean = false;

  // CLIENTE ACTIVO
  dataClient: Client;
  dataPerson: Person;
  dataCompany: Company;

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _typeStatusService: TypeStatusService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.initForm();

    // DATOS PERSONA COMPARTIDO
    this.subscription.add(
      this._sharedClientService.getDataPerson()
      .pipe(filter((value) => value != null))
      .subscribe((data: Person) => {
        this.dataPerson = data;

        const contact = data.contacts.find((item) => item.tipo == 'CEL');
        const identification = data.identifications[0];

        if(this.fixedLineForm){
          this.fixedLineForm.get('titular').setValue(`${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`)
          this.fixedLineForm.get('tipo_documentos_id').setValue(identification?.tipo_documentos_id)
          this.fixedLineForm.get('documento_titular').setValue(identification?.documento)
          this.fixedLineForm.get('num_portar').setValue(contact?.contacto)
        }

      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      diferente_titular: [false, [Validators.nullValidator]],
    }
  }

}
