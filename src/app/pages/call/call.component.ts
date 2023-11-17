import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { FileUploadUtil } from 'src/app/core/helpers';
import {  Breadcrumb, OperatorList, Pagination, ResponseApi, ResponsePagination, TypeStatusList, TypificationCallList } from 'src/app/core/models';
import { Call, CallList } from 'src/app/core/models/api/call.model';
import { ApiErrorFormattingService, FormService, OperatorService, SweetAlertService, TypeStatusService, TypificationCallService } from 'src/app/core/services';
import { CallService} from 'src/app/core/services/api/call.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear Llamada',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Llamadas';
  breadCrumbItems: Array<{}>;

  // Form
  isNewData: boolean = true;
  submitted: boolean = false;
  callForm: FormGroup;

    
  // TABLE SERVER SIDE
  page: number = 1;
  perPage: number = 5;
  search: string = '';
  column: string = '';
  order: 'asc' | 'desc' = 'desc';
  countElements: number[] = [5, 10, 25, 50, 100];
  total: number = 0;
  pagination: Pagination = new Pagination();

  // Table data
  // content?: any;
  lists?: CallList[] = [];

  // Tipo de servicios;
  listTypeStatus?: TypeStatusList[];

  // Operadores;
  listOperators?: OperatorList[] = [];

  // Operadores;
  listTypificationCall?: TypificationCallList[] = [];


  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private _operatorService: OperatorService,
    private _typificationCallService: TypificationCallService,
    private _typeStatusService: TypeStatusService,
    private _callService: CallService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }
  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Llamadas', active: true }]);

    this.initForm();
    this.listDataApi();
    // this.apiTypeStatusList();
    this.apiTypeStatusList();
    this.apiOperatorList();
    this.apiTypificationCallList(),

    this.apiCallListPagination();

    // this.subscription.add(
    //   this._callService.listObserver$
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: CallList[]) => {
    //     this.lists = list;
    //   })
    // );

    // Tipo de estados
    this.subscription.add(
      this._typeStatusService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeStatusList[]) => {
        this.listTypeStatus = list;
      })
    );

    // Operadores
    this.subscription.add(
      this._operatorService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: OperatorList[]) => {
        this.listOperators = list;
      })
    );

    // Tipificaqciones
    this.subscription.add(
      this._typificationCallService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypificationCallList[]) => {
        this.listTypificationCall = list;
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
    this._callService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Call | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._callService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: CallList = CallList.cast(response.data[0]);
            this._callService.addObjectObserver(data);
          }

          this.apiCallListPagination();
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

  private updateDataApi(data: Call | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this._callService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: CallList = CallList.cast(response.data[0]);
        this._callService.updateObjectObserver(data);

        this.apiCallListPagination();
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
    this._callService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: CallList = CallList.cast(response.data[0]);
        this._callService.removeObjectObserver(data.id);
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
   * SERVER SIDE - PROMOCIÓN
   * ***************************************************************
   */
  apiCallListPagination(): void {
    this.subscription.add(
      this._callService.getPagination({
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar promociones', message: error.message, timer: 2500});
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
      this.apiCallListPagination();
    }, 0);
  }

  getPageRefresh(){
    this.page = 1;
    this.perPage = 10;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiCallListPagination();
    }, 0);
  }

    
  /**
   * *******************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *******************************************************
   */
  // Tipo documento
  public apiTypeStatusList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeStatusService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listTypeStatus = response.data;
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

  // Operadores
  public apiOperatorList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._operatorService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listOperators = response.data;
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

  // Tipificaciones
  public apiTypificationCallList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typificationCallService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listTypificationCall = response.data;
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
  get form() {
    return this.callForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model
   */
  private initForm(){
    const call = new Call();
    const formGroupData = this.getFormGroupData(call);
    this.callForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model
   * @returns
   */
  private getFormGroupData(model: Call): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      numero: ['', [Validators.required, Validators.maxLength(11)]],
      operadores_id: ['', [Validators.required, Validators.min(1)]],
      operadores_llamo_id: ['', [Validators.nullValidator, Validators.min(1)]],
      tipificaciones_llamadas_id: [null, [Validators.nullValidator, Validators.min(1)]],
      nombres: ['', [Validators.nullValidator, Validators.maxLength(60)]],
      apellido_paterno: ['', [Validators.nullValidator, Validators.maxLength(60)]],
      apellido_materno: ['', [Validators.nullValidator, Validators.maxLength(60)]],
      direccion: ['', [Validators.nullValidator, Validators.maxLength(250)]],
      permanencia: [false, [Validators.nullValidator]],
      permanencia_tiempo: ['', [Validators.nullValidator, Validators.maxLength(150)]],
      tipo_estados_id: ['', [Validators.required, Validators.min(1)]],
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
    this.dataModal.title = 'Crear Llamada';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-lg modal-dialog-centered' });
    this.modalRef.onHide.subscribe(() => {});
  }





  /**
    * Save
  */
  saveData() {
    if(!this.callForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Call = this.callForm.value;
      if(values.tipificaciones_llamadas_id == null){
        delete values.tipificaciones_llamadas_id;
      }

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la llamada?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la llamada?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateDataApi(values, values.id);
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
    this.openModal(content);
    this.dataModal.title = 'Editar Llamada';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const call= Call.cast(data);
    this.callForm = this.formBuilder.group({...this._formService.modelToFormGroupData(call), id: [data.id], file: [null, []]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la llamada?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }

}
