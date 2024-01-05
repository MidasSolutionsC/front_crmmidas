import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, Manual, ManualList, Pagination, PaginationResult, ResponseApi, ResponsePagination, SocketModel } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SessionUserService, SweetAlertService } from 'src/app/core/services';
import { ManualService } from 'src/app/core/services';
import { FileUploadUtil } from 'src/app/core/helpers';
import { SocketService } from 'src/app/core/services/shared/socket.service';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear manual',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Manuales';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  manualForm: FormGroup;

  // TABLE SERVER SIDE
  // page: number = 1;
  // perPage: number = 5;
  // search: string = '';
  // column: string = '';
  // order: 'asc' | 'desc' = 'desc';
  // countElements: number[] = [2, 5, 10, 25, 50, 100];
  // total: number = 0;
  // pagination: PaginationResult = new PaginationResult();

  
  // PAGINACIÓN
  countElements: number[] = [2, 5, 10, 25, 50, 100];
  pagination: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>({
    page: 1,
    perPage: 5,
    search: '',
    column: '',
    order: 'desc',
  });

  paginationResult: PaginationResult = new PaginationResult();

  // Archivos subidos
  uploadFiles: File[];


  // Table data
  // content?: any;
  lists?: ManualList[] = [];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService, 
    private _manualService: ManualService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private _socketService: SocketService,
    private _sessionUserService: SessionUserService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Manual', active: true }]);

    this.initForm();
    this.listDataApi();
    this.apiManualListPagination();

    // SOCKET 
    // this.listenSocket()

    // this.subscription.add(
    //   this._manualService.listObserver$
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: ManualList[]) => {
    //     this.lists = list;
    //   })
    // );


    
    // EMIT CONSULTA PAGINACIÓN
    this.subscription.add(
      this.pagination.asObservable()
        .subscribe((pagination: Pagination) => {
          this.apiManualListPagination()
        })
    );

    this.subscription.add(
      this._socketService.outEven.subscribe((data: SocketModel) => {
        // console.log("DATOS DEL SOCKET RECIBIDO:", data)
        switch(data.process){
          case 'manual':
            const row = data.content;
            // NUEVO
            if(data.operation == 'nuevo'){
              this.apiManualListPagination()
            }
            
            // MODIFICADO
            if(data.operation == 'modificado'){
              this.apiManualListPagination()
            }
            
            // ELIMINADO
            if(data.operation == 'eliminado'){
              this.apiManualListPagination()
            }
            break;

          default:
            break;
        }
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  
  /**
   * *************************************************************************************
   * DETECTAR CAMBIOS - SOCKET
   * *************************************************************************************
   */
  listenSocket(){
    this.subscription.add(
      this._socketService.outEven.subscribe((data: SocketModel) => {
        console.log("DATOS DEL SOCKET RECIBIDO:", data)
        switch(data.process){
          case 'manual':
            const row = data.content;
            // NUEVO
            if(data.operation == 'nuevo'){
              this.apiManualListPagination()
            }
            
            // MODIFICADO
            if(data.operation == 'modificado'){
              this.apiManualListPagination()
            }
            
            // ELIMINADO
            if(data.operation == 'eliminado'){
              this.apiManualListPagination()
            }
            break;

          default:
            break;
        }
      })
    );
  }
  

  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  public listDataApi(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._manualService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Manual | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._manualService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: ManualList = ManualList.cast(response.data[0]);
            this._manualService.addObjectObserver(data);
            this._socketService.emitEvent({
              sender: this._sessionUserService.getDataUser(), 
              process: 'manual', 
              operation: 'nuevo',
              content: data
            });
          }

          this.apiManualListPagination();
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

  private updateDataApi(data: Manual | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this._manualService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: ManualList = ManualList.cast(response.data[0]);
        this._manualService.updateObjectObserver(data);

        this.apiManualListPagination();
        this.modalRef?.hide();

        this._socketService.emitEvent({
          sender: this._sessionUserService.getDataUser(), 
          process: 'manual', 
          operation: 'modificado',
          content: data
        });
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
    this._manualService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: ManualList = ManualList.cast(response.data[0]);
        this._manualService.removeObjectObserver(data.id);
        this.apiManualListPagination();
        this._socketService.emitEvent({
          sender: this._sessionUserService.getDataUser(), 
          process: 'manual', 
          operation: 'eliminado',
          content: data
        });
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
 * SERVER SIDE - 
 * ***************************************************************
 */
  public apiManualListPagination(): void {
    this.subscription.add(
      this._manualService.getPagination(this.pagination.getValue())
        .pipe(debounceTime(250))
        .subscribe((response: ResponsePagination) => {
          if (response.code == 200) {
            this.paginationResult = PaginationResult.cast(response.data);
            this.lists = response.data.data;
          }

          if (response.code == 500) {
            if (response.errors) {
              this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
            }
          }
        }, (error: any) => {
          if (error.message) {
            this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar países', message: error.message, timer: 2500 });
          }
        })
    );
  }

  getPage(event: any) {
    const { page, itemsPerPage: perPage } = event;
    this.pagination.next({ ...this.pagination.getValue(), page, perPage })
  }

  getPageRefresh() {
    this.pagination.next({ ...this.pagination.getValue(), page: 1, perPage: 10 })
  }



  /**
   * Form data get
   */
  get form() {
    return this.manualForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const manual = new Manual();
    const formGroupData = this.getFormGroupData(manual);
    this.manualForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Manual): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
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
    this.dataModal.title = 'Crear manual';
    this.submitted = false;
    this.uploadFiles = [];
    this.modalRef = this.modalService.show(content, { class: 'modal-md modal-dialog-centered' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
   * Subir archivo
   * @param fileInput elemento input
   */
  async onFileSelected(fileInput: HTMLInputElement){
    const { files, error } = FileUploadUtil.handleFileUpload(fileInput, [], 0);

    if (files.length > 0) {
      this.form.file.setValue('file_upload');
      this.uploadFiles = files;
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
    if(!this.manualForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Manual = this.manualForm.value;
      const formData = new FormData();

      // Iterar a través de las propiedades de 'values' y Crearlas al FormData
      for (const key of Object.keys(values)) {
        formData.append(key, values[key]);
      }

      if(this.uploadFiles){
        this.uploadFiles.forEach((file) => {
          formData.append('file', file);
        });
      } else {
        formData.delete('file');
      }

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el tipo de servicio?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(formData);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el tipo de servicio?').then((confirm) => {
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
    this.dataModal.title = 'Editar manual';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const manual = Manual.cast(data);
    this.manualForm = this.formBuilder.group({...this._formService.modelToFormGroupData(manual), id: [data.id], file: [null, []]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el manual?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
