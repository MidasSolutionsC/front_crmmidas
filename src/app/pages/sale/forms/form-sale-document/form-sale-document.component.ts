import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { ResponseApi, SaleDocument, SaleDocumentList, TypeDocumentList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SharedSaleService, SweetAlertService, TempSaleDocumentService, TypeDocumentService } from 'src/app/core/services';
import { FileUploadUtil } from 'src/app/core/helpers';

@Component({
  selector: 'app-form-sale-document',
  templateUrl: './form-sale-document.component.html',
  styleUrls: ['./form-sale-document.component.scss']
})
export class FormSaleDocumentComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('focusNombre') focusNombre: ElementRef<HTMLInputElement>;

  // Datos de entrada
  @Input() data: SaleDocument = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // FORMULARIO DOCUMENT
  isNewData: boolean = true;
  submitted: boolean = false;
  documentForm: FormGroup;

  // Archivos subidos
  uploadFiles: File[];

  // Previsualizar foto subido
  previewImage: any;

  listTypeDocuments: TypeDocumentList[] = [];

  saleId: number;
  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;
  
    
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _shareSaleService: SharedSaleService,
    private _typeDocumentService: TypeDocumentService,
    private _tmpSaleDocumentService: TempSaleDocumentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}


  ngOnInit(): void {
    // Instanciar form
    this.initForm();
    this.apiTypeDocumentList();

    // ID VENTA
    this.subscription.add(
      this._shareSaleService.getSaleId().subscribe((value: number) => {
        this.saleId = value;
      })
    )

    // Tipos de documentos
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeDocumentList[]) => {
        this.listTypeDocuments = list;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data && !changes.data.firstChange){
     this.onChangeData();
    }
  }



  onChangeData(){
    if(this.data){
      this.documentForm.setValue({...this.data, file: ''});
      this.isNewData = false;
      setTimeout(() => {
        this.focusNombre.nativeElement.focus();
      }, 50);
    } else {
      this.isNewData = true;
    }
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  private apiTempSaleDocumentSave(data: SaleDocument | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tmpSaleDocumentService.registerComplete(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: SaleDocumentList = SaleDocumentList.cast(response.data[0]);
            this._tmpSaleDocumentService.addObjectObserver(data);
            this.onReset();
            this.submit.emit({saved: true, data});

            if(data.ventas_id){
              this._shareSaleService.setSaleId(data.ventas_id);
            }
          }
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
          }
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar archivos', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiTempSaleDocumentUpdate(data: SaleDocument | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tmpSaleDocumentService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: SaleDocumentList = SaleDocumentList.cast(response.data[0]);
            this._tmpSaleDocumentService.updateObjectObserver(data);
            this.onReset();
            this.submit.emit({saved: true});
          }
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
          }
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar archivos', message: error.message, timer: 2500});
        }
      })
    )
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API FORÁNEOS
   * ****************************************************************
   */
  // OPERACIONES CON LA API - TIPO DE DOCUMENTOS
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeServices = response.data; El servicio lo emite al observable
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tipos de documentos', message: error.message, timer: 2500});
      }
    });
  }

    
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - DOCUMENTO
   * ***********************************************
   */
  get f() {
    return this.documentForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: SaleDocument = new SaleDocument()){
    const formGroupData = this.getFormGroupData(model);
    this.documentForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: SaleDocument): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      // tipo: [model.tipo, [Validators.required, Validators.min(1)]],
      nombre: [model.nombre, [Validators.required]],
      tipo_documentos_id: [model.tipo_documentos_id || '', [Validators.required]],
      file: [null, [Validators.required]],
      is_active: [1, [Validators.nullValidator]],
    }
  }


  /**
   * **************************************************************
   * CARGAR ARCHIVO 
   * **************************************************************
  * @param fileInput elemento input
  */
  async onFileSelected(fileInput: HTMLInputElement){
    const { files, error } = await FileUploadUtil.handleFileUploadBase64(fileInput, [], 0);

    if (files.length > 0) {
      this.f.file.setValue('file_upload');
      this.previewImage = files[0].base64;
      this.uploadFiles = files.map((file) => file.file);

      // Separa el nombre del archivo en partes usando el punto como separador
      const parts = files[0]?.file.name.split('.');
      const fileExtension = parts[parts.length - 1];
      this.f.tipo.setValue(fileExtension);
    } else {
      this._sweetAlertService.showTopEnd({title: 'Archivo seleccionado', message: error, type: 'error', timer: 2500});
    }
  }

  /**
   * ELIMINAR ARCHIVO SUBIDO
   */

  clearFile() {
    if(this.fileInput){
      this.fileInput.nativeElement.value = '';
    }
    this.f.file.setValue(null);
    this.previewImage = '';
    this.uploadFiles = [];
  }
  
  

  /**
   * ************************************************************
   * EMITIR EL VALOR DEL FORMULARIO
   * ************************************************************
   */
  onSubmit() {
    this.submitted = true;

    if(this.documentForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: SaleDocument = this.documentForm.value;
      const formData = new FormData();

       // Iterar a través de las propiedades de 'values' y agregarlas al FormData
       for (const key of Object.keys(values)) {
        if(values[key] != null){
          formData.append(key, values[key]);
        }
      }

      if(this.saleId){
        values.ventas_id = this.saleId;
        formData.append('ventas_id', this.saleId.toString());
      }

      if(this.uploadFiles && this.uploadFiles.length > 0){
        this.uploadFiles.forEach((file) => {
          formData.append('file', file);
        });
      } else {
        formData.delete('file');
      }

      if(this.isNewData){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el archivo?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiTempSaleDocumentSave(formData);
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar el archivo?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiTempSaleDocumentUpdate(formData, values.id);
          }
        });
      }
      
      // this.submit.emit(formData);
    }

  }

  onCancel(){
    this.onReset();
    this.focusNombre.nativeElement.focus();
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.documentForm.reset();
    this.documentForm.controls.is_active.setValue(1);
    this.fileInput.nativeElement.value = '';
    this.previewImage = '';
    this.submitted = false;
    this.isNewData = true;
  }
}
