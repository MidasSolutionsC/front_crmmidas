import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { FileUploadUtil } from 'src/app/core/helpers';
import { Breadcrumb, ResponseApi, TypeDocumentList } from 'src/app/core/models';
import { Sale, SaleList} from 'src/app/core/models/api/sale.model';
import {ApiErrorFormattingService, FormService, SweetAlertService, TypeDocumentService } from 'src/app/core/services';
import {SaleService } from 'src/app/core/services/api/sale.service';
import { ModalRegisterComponent } from './modals/modal-register/modal-register.component';
import { ModalUpdateComponent } from './modals/modal-update/modal-update.component';
import { ModalDetailComponent } from './modals/modal-detail/modal-detail.component';
import { ModalFormComponent } from './modals/modal-form/modal-form.component';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent {

  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear Venta',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Ventas';
  breadCrumbItems: Array<{}>;

  // Form
  isNewData: boolean = true;
  submitted: boolean = false;
  saleForm: FormGroup;

  // Formulario para buscar usuarios
  userSearchForm: FormGroup;

  // Archivos subidos
  uploadFiles: File[];

  // Previsualizar foto subido
  previewImage: any;


  // Table data
  // content?: any;
  lists?: SaleList[];

  // Lista de tipos de documentos
  listTypeDocuments?: TypeDocumentList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService,
    private _typeDocumentService: TypeDocumentService,
    private _saleService: SaleService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }
  
  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Ventas', active: true }]);

    this.initForm();
    this.initFormUserSearch();
    this.apiTypeDocumentList();
    
    this.listDataApi();
    this.subscription.add(
      this._saleService.listObserver$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: SaleList[]) => {
        this.lists = list;
      })
    );

    // Tipo de documentos
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: TypeDocumentList[]) => {
        this.listTypeDocuments = list;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  public listDataApi(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.lists = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  private saveDataApi(data: Sale | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._saleService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: SaleList = SaleList.cast(response.data[0]);
            this._saleService.addObjectObserver(data);
          }

          this.uploadFiles = [];
          this.modalRef?.hide();
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
        console.log(error);
      })
    )
  }

  private updateDataApi(data: Sale | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this._saleService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleList = SaleList.cast(response.data[0]);
        this._saleService.updateObjectObserver(data);
        this.uploadFiles = [];
        this.modalRef?.hide();
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
    }, (error: ResponseApi) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  private deleteDataApi(id: number){
    this._sweetAlertService.loadingUp()
    this._saleService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleList = SaleList.cast(response.data[0]);
        this._saleService.removeObjectObserver(data.id);
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
    }, (error: ResponseApi) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  /**
   * *************************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *************************************************************
   */
  // Tipo documento
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listTypeDocuments = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }



  /**
   * Form data get
   */
  get f() {
    return this.saleForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model
   */
  private initForm(){
    const sale = new Sale();
    const formGroupData = this.getFormGroupData(sale);
    this.saleForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model
   * @returns
   */
  private getFormGroupData(model: Sale): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      comentario: ['', [Validators.required, Validators.maxLength(50)]],
      is_active: [1, [Validators.nullValidator]],
    }
  }

  /**
 * FORM SEARCH USER
 */
  get fs() {
    return this.userSearchForm.controls;
  }

  private initFormUserSearch(){
    this.userSearchForm = this.formBuilder.group({
      tipo_documentos_id: ['', [Validators.nullValidator, Validators.min(0)]],
      documento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(11)]],
      search: ['', [Validators.nullValidator]],
    });
  }
  

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear Venta';
    this.submitted = false;
    this.previewImage = null;
    this.uploadFiles = [];
    this.modalRef = this.modalService.show(content, { class: 'modal-fullscreen modal-dialog-centered' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
   * Subir archivo
   * @param fileInput elemento input
   */
  async onFileSelected(fileInput: HTMLInputElement){
    const { files, error } = await FileUploadUtil.handleFileUploadBase64(fileInput, ['jpg', 'jpeg', 'png'], 0);

    if (files.length > 0) {
      this.f.file.setValue('file_upload');
      this.previewImage = files[0].base64;
      this.uploadFiles = files.map((file) => file.file);
      // this.uploadFiles = files;
      // Realiza acciones adicionales con los archivos, como subirlos al servidor
    } else {
      // Maneja el error, por ejemplo, muestra un mensaje de error al usuario
      // console.error(error);
      this._sweetAlertService.showTopEnd({title: 'Archivo seleccionado', message: error, type: 'error', timer: 2500});
    }
  }


  /**
    * Save
  */
  saveData() {
    if(!this.saleForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Sale = this.saleForm.value;
      const formData = new FormData();

      // Iterar a través de las propiedades de 'values' y agregarlas al FormData
      for (const key of Object.keys(values)) {
        formData.append(key, values[key]);
      }

      if(this.uploadFiles && this.uploadFiles.length > 0){
        this.uploadFiles.forEach((file) => {
          formData.append('file', file);
        });
      } else {
        formData.delete('file');
      }

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la Venta?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(formData);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la Venta?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateDataApi(formData, values.id);
          }
        });
      }
    }

    this.submitted = true;
  }

  /**
 * Open Edit modal
 * @param content modal content
 */
  editDataGet(id: any, content: any) {
    this.modalRef = this.modalService.show(content, { class: 'modal-fullscreen' });
    this.dataModal.title = 'Editar Venta';
    this.isNewData = false;
    this.submitted = false;
    this.previewImage = '';
    // Cargando datos al formulario
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const sale = Sale.cast(data);
    this.saleForm = this.formBuilder.group({...this._formService.modelToFormGroupData(sale), id: [data.id], file: [null, []]});
    
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la Venta?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }

  // Mostrar formulario de edición 
  getEditRow(data: any){
    this.openModalFormEdit(data);
  }




  /**
   * *************************************************************
   * MODAL COMPONENTE EXTERNO - FORMULARIO DE REGISTRO
   * *************************************************************
   */
  openModalForm(){
    const initialState = {};
    this.modalRef = this.modalService.show(ModalFormComponent, {initialState, class: 'modal-xl modal-dialog-centered modal-dialog-scrollable', backdrop: 'static'});
    this.modalRef.onHide.subscribe((value) => {
      // console.log(value);
    });
  }

  // MODAL - FORMULARIO DE VENTA
  openModalFormRegister(){
    const initialState = {};
    this.modalRef = this.modalService.show(ModalRegisterComponent, {initialState, class: 'modal-fullscreen modal-dialog-centered modal-dialog-scrollable'});
    this.modalRef.onHide.subscribe((next) => {
      // console.log(next);
    });
  }

  // FORMULARIO DE EDICIÓN
  openModalFormEdit(data: any){
    const initialState = {
      dataInput: data
    };
    this.modalRef = this.modalService.show(ModalUpdateComponent, {initialState, class: 'modal-xl modal-dialog-centered modal-dialog-scrollable', backdrop: 'static'});
    this.modalRef.onHide.subscribe((next) => {
      // console.log(next);
    });
  }

  // DETALLE DE LA VENTA
  openModalDetail(data: any){
    const initialState = {
      dataInput: data
    };
    this.modalRef = this.modalService.show(ModalDetailComponent, {initialState, class: 'modal-xl modal-dialog-centered modal-dialog-scrollable'});
    this.modalRef.onHide.subscribe((next) => {
      // console.log(next);
    });
  }
}
