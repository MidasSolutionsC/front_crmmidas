import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResponseApi, SaleDocument, SaleDocumentList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SweetAlertService, TmpSaleDocumentService } from 'src/app/core/services';
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
  
    
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _tmpSaleDocumentService: TmpSaleDocumentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}


  ngOnInit(): void {
    // Instanciar form
    this.initForm();
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
  private apiSaleDocumentSave(data: SaleDocument | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tmpSaleDocumentService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: SaleDocumentList = SaleDocumentList.cast(response.data[0]);
            this._tmpSaleDocumentService.addObjectObserver(data);
            this.onReset();
            this.submit.emit({saved: true, data});
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

  private apiSaleDocumentUpdate(data: SaleDocument | FormData, id: number){
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

      const idVenta = localStorage.getItem('ventas_id');
      if(idVenta !== null && idVenta !== undefined){
        values.ventas_id = parseInt(idVenta);
        formData.append('ventas_id', idVenta);
      }

      // Iterar a través de las propiedades de 'values' y agregarlas al FormData
      for (const key of Object.keys(values)) {
        if(values[key] != null){
          formData.append(key, values[key]);
        }
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
            this.apiSaleDocumentSave(formData);
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar el archivo?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiSaleDocumentUpdate(formData, values.id);
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
