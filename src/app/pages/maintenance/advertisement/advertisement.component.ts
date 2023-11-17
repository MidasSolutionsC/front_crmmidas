import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { FileUploadUtil } from 'src/app/core/helpers';
import { Advertisement, AdvertisementList, Breadcrumb, Pagination, ResponseApi, ResponsePagination } from 'src/app/core/models';
import { AdvertisementService, ApiErrorFormattingService, ConfigService, FormService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear anuncio',
  }


  // bread crumb items
  titleBreadCrumb: string = 'Anuncios';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  advertisementForm: FormGroup;

  // TABLE SERVER SIDE
  page: number = 1;
  perPage: number = 5;
  search: string = '';
  column: string = '';
  order: 'asc' | 'desc' = 'desc';
  countElements: number[] = [5, 10, 25, 50, 100];
  total: number = 0;
  pagination: Pagination = new Pagination();

  // Archivos subidos
  uploadFiles: File[];

  // Previsualizar foto subido
  previewImage: any;

  URL_FILES: string = '';

  // Table data
  // content?: any;
  lists?: AdvertisementList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private _configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService, 
    private _advertisementService: AdvertisementService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

      this.URL_FILES = this._configService.urlFiles + 'advertisement/';

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Anuncios', active: true }]);

    this.initForm();
    this.listDataApi();
    this.apiAdvertisementListPagination();

    // this.subscription.add(
    //   this._advertisementService.listObserver$
    //   // .pipe(distinctUntilChanged())
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: AdvertisementList[]) => {
    //     this.lists = list;
    //   })
    // );
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
    this._advertisementService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Advertisement | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._advertisementService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: AdvertisementList = AdvertisementList.cast(response.data[0]);
            this._advertisementService.addObjectObserver(data);
          }

          this.uploadFiles = [];

          this.apiAdvertisementListPagination();
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

  private updateDataApi(data: Advertisement | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this._advertisementService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: AdvertisementList = AdvertisementList.cast(response.data[0]);
        this._advertisementService.updateObjectObserver(data);
        this.uploadFiles = [];

        this.apiAdvertisementListPagination();
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
    this._advertisementService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: AdvertisementList = AdvertisementList.cast(response.data[0]);
        this._advertisementService.removeObjectObserver(data.id);
        this.apiAdvertisementListPagination();
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
 * ***************************************************************
 * SERVER SIDE - USERS
 * ***************************************************************
 */
  apiAdvertisementListPagination(): void {
    this.subscription.add(
      this._advertisementService.getPagination({
        page: this.page.toString(),
        perPage: this.perPage.toString(),
        search: this.search,
        column: this.column,
        order: this.order
      })
      .pipe(debounceTime(250))
      .subscribe((response: ResponsePagination) => {
        if(response.code == 200){
          this.pagination = Pagination.cast(response.data);
          this.lists = response.data.data;
          this.page = response.data.current_page;
          this.total = response.data.total;
        }
        
        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error: any) => {
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar anuncios', message: error.message, timer: 2500});
        }
      })
    ); 
  }

  getPage(event: any){
    const {page, itemsPerPage} = event;
    this.page = page;
    this.perPage = itemsPerPage;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiAdvertisementListPagination();
    }, 0);
  }

  getPageRefresh(){
    this.page = 1;
    this.perPage = 10;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiAdvertisementListPagination();
    }, 0);
  }
  


  /**
   * Form data get
   */
  get form() {
    return this.advertisementForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const advertisement = new Advertisement();
    const formGroupData = this.getFormGroupData(advertisement);
    this.advertisementForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Advertisement): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(550)]],
      tipo: ['', [Validators.required, Validators.maxLength(1)]],
      file: [null, [Validators.required]],
      is_active: [1, [Validators.nullValidator]],
    }
  }
  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear anuncio';
    this.submitted = false;
    this.previewImage = null;
    this.uploadFiles = [];
    this.modalRef = this.modalService.show(content, { class: 'modal-md modal-dialog-centered' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
   * Subir archivo
   * @param fileInput elemento input
   */
  async onFileSelected(fileInput: HTMLInputElement){
    const { files, error } = await FileUploadUtil.handleFileUploadBase64(fileInput, ['jpg', 'jpeg', 'png'], 0);

    if (files.length > 0) {
      this.form.file.setValue('file_upload');
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
    if(!this.advertisementForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Advertisement = this.advertisementForm.value;
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
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el anuncio?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(formData);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el anuncio?').then((confirm) => {
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
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.dataModal.title = 'Editar anuncio';
    this.isNewData = false;
    this.submitted = false;
    this.previewImage = '';
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const advertisement = Advertisement.cast(data);
    this.advertisementForm = this.formBuilder.group({...this._formService.modelToFormGroupData(advertisement), id: [data.id], file: [null, []]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el tipo de documento?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
