import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged, filter } from 'rxjs';
import { IdentificationDocument, ResponseApi, TypeDocumentList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SharedClientService, SweetAlertService, TypeDocumentService } from 'src/app/core/services';

@Component({
  selector: 'app-form-identification',
  templateUrl: './form-identification.component.html',
  styleUrls: ['./form-identification.component.scss']
})
export class FormIdentificationComponent implements OnInit, OnDestroy, OnChanges{

  // Datos de entrada
  @Input() data: IdentificationDocument[] = [];
  @Input() submitted: boolean = false;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // MOSTRAR LISTA
  showList: boolean = true;
  showDocumentReverse: boolean = false;
    
  isNewData: boolean = true;
  // submitted: boolean = false;
  identificationForm: FormGroup;

  // Tipo documentos
  listTypeDocument?: TypeDocumentList[];
  listTypeDocumentFilter?: TypeDocumentList[];

  legalPerson: boolean = false;
  typeClientText: string = '';

  private subscription: Subscription = new Subscription();
  
  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _typeDocumentService: TypeDocumentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
    ) {

  }

  ngOnInit(): void {
    this.apiTypeDocumentList();
    
    this.identificationForm = this.formBuilder.group({
      formList: this.formBuilder.array([]),
    }),
    
    this.formDataIdentification.push(this.fieldIdentification({is_primary: 1, show_reverse: false}));
    
    this.onChangeData();
    
    // RESETEAR DATOS
    this.subscription.add(
      this._sharedClientService.getClearData()
        .pipe(filter(value => value !== null))
        .subscribe((value: boolean) => {
        if(value){
          this.onReset();
        }
      })
    )

    // PERSONA LEGAL
    this.subscription.add(
      this._sharedClientService.getLegalPerson().subscribe((value: boolean) =>  {
        this.legalPerson = value;
      })
    )

    // TIPO DE CLIENTE
    this.subscription.add(
      this._sharedClientService.getTypeClient().subscribe((value: string) =>  {
        this.typeClientText = value;
        if(value && this.listTypeDocument?.length > 0){
          const index = this.formDataIdentification.controls.length - 1;

          if(value == 'RE'){
            const selectedTypeDocumentId = this.listTypeDocument?.find((typeDocument) => typeDocument.abreviacion == 'DNI').id;
            this.formDataIdentification.controls[index].get('tipo_documentos_id').setValue(selectedTypeDocumentId);
          } else {
            const selectedTypeDocumentId = this.listTypeDocument?.find((typeDocument) => typeDocument.abreviacion == 'NIF').id;
            this.formDataIdentification.controls[index].get('tipo_documentos_id').setValue(selectedTypeDocumentId);
          }
        }
      })
    )

    // Tipo de documentos
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(
        distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
            )
          )
          .subscribe((list: TypeDocumentList[]) => {
            this.listTypeDocument = list;
            this.filterDocumentList();
      })
    );
  
    // SUMMIT - EMITIR DATOS HACIA AFUERA
    // this.subscription.add(
    //   this._sharedClientService.getSubmitData()
    //   .pipe(filter(value => value !== null))
    //   .subscribe((value: boolean) => {
    //     if(value){
    //       this.onSubmit();
    //     }
    //   })
    // )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !changes.data.firstChange) {
      this.onChangeData();
    }
  }

  // DATOS EMITIDOS
  onChangeData() {
    if (this.identificationForm){
      this.identificationForm = this.formBuilder.group({
        formList: this.formBuilder.array([]),
      })

      if (this.data.length > 0) {
        this.data.forEach((item) => {
          // if(!item.show_reverse){
            //   item.show_reverse = false;
            // }
          this.formDataIdentification.push(this.fieldIdentification(IdentificationDocument.cast(item)));
        })
        this.isNewData = false;
      } else {
        this.formDataIdentification.push(this.fieldIdentification({is_primary: 1}));
        this.isNewData = true;
      }
    }
  }

  /**
   * ***********************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * ***********************************************************
   */
  // Tipo documento
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listTypeDocument = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      // console.log(error);
    });
  }
  
  // FILTRAR TIPO DE DOCUMENTOS
  private filterDocumentList(){
    let selectedTypeDocumentId = null;
    if(this.listTypeDocument.length > 0){
      const index = this.formDataIdentification.controls.length - 1;
      if(!this.legalPerson){
        this.listTypeDocumentFilter = this.listTypeDocument.filter((typeDocument) => typeDocument.abreviacion !== 'RUC');
        selectedTypeDocumentId = this.listTypeDocument?.find((typeDocument) => typeDocument.abreviacion == 'DNI').id;
        this.formDataIdentification.controls[index].get('tipo_documentos_id').setValue(selectedTypeDocumentId);
      } else {
        this.listTypeDocumentFilter = this.listTypeDocument.filter((typeDocument) => typeDocument.abreviacion !== 'DNI');
        selectedTypeDocumentId = this.listTypeDocument.find((typeDocument) => typeDocument.abreviacion == 'RUC').id;
        this.formDataIdentification.controls[index].get('tipo_documentos_id').setValue(selectedTypeDocumentId);
      }
    }
  }


  /**
   * *******************************************************
   * AGREGAR MÁS CAMPOS DE TIPO Y DOCUMENTO
   * *******************************************************
   */

  fieldIdentification(model: IdentificationDocument = new IdentificationDocument()): FormGroup {
    const formGroup = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(model),
      tipo_documentos_id: [model?.tipo_documentos_id || '', [Validators.required, Validators.min(1)]],
      documento: [model?.documento, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      reverso_documento: [model?.reverso_documento, [Validators.nullValidator, Validators.minLength(2), Validators.maxLength(250)]],
      is_primary: [model?.is_primary || 0, [Validators.nullValidator]],
      show_reverse: [model?.show_reverse || false, [Validators.nullValidator]],
    });

    // Agrega la validación personalizada para evitar duplicados
    // formGroup.setValidators(this.duplicateValidator());
    return formGroup;
  }

  duplicateValidator(): ValidatorFn {
    return (control: FormArray): ValidationErrors | null => {
      const values = control.value; // Obtiene los valores del FormArray
  
      for (let i = 0; i < values.length - 1; i++) {
        for (let j = i + 1; j < values.length; j++) {
          if (
            values[i].tipo_documentos_id === values[j].tipo_documentos_id &&
            values[i].documento === values[j].documento
          ) {
            return { duplicate: true }; // Encuentra duplicados
          }
        }
      }
  
      return null; // No se encontraron duplicados
    };
  }
  
  
  get formDataIdentification(): FormArray {
    return this.identificationForm.get('formList') as FormArray;
  }

  // OCULTAR BOTON DE CERRAR
  get visibleCloseBtn(){
    let minItems = 1;
    return this.formDataIdentification.length > 1;
  }

  // ELIMINAR UN OBJETO DE IDENTIFICACIÓN
  removeFieldIdentification(i: number) {
    this.formDataIdentification.removeAt(i);
  }

  // AÑADIR NUEVO OBJETO DE IDENTIFICACIÓN
  addFieldIdentification() {
    this.showList = true;
    this.formDataIdentification.push(this.fieldIdentification());
  }


  
  /**
 * ************************************************************
 * EMITIR EL VALOR DEL FORMULARIO
 * ************************************************************
 */
  onSubmit() {
    this.submitted = true;
    if (this.formDataIdentification.invalid) {
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
      this.submit.emit({ emit: true, values: [] });
    } else {
      const values = this.formDataIdentification.value;
      this.submit.emit({ emit: true, values });
    }
  }

  onCancel() {
    this.onReset();
    this.cancel.emit({ message: 'Cancelado' });
  }

  onReset() {
    this.submitted = false;
    this.isNewData = true;
    this.formDataIdentification.reset();
    this.formDataIdentification.clear();
    this.formDataIdentification.push(this.fieldIdentification({is_primary: 1}));
  }

}
