import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, Pagination, ProductList, PromotionList, ResponseApi, ResponsePagination, Service, ServiceList, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, ProductService, PromotionService, ServiceService, SweetAlertService, TypeServiceService } from 'src/app/core/services';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear servicio',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Servicios';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  serviceForm: FormGroup;

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
  lists?: ServiceList[] = [];

  // Tipo de servicios
  listTypeServices: TypeServiceList[] = [];

  // Productos
  listProducts: ProductList[] = [];

  // Promociones
  listPromotions: PromotionList[] = [];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService, 
    private _typeServiceService: TypeServiceService,
    private _productService: ProductService,
    private _promotionService: PromotionService,
    private _serviceService: ServiceService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Servicios', active: true }]);

    this.initForm();
    // this.listDataApi();
    this.apiServiceListPagination();
    // this.apiTypeServiceList();
    // this.apiProductList();
    // this.apiPromotionList();
    this.apiTypeServiceSearch();
    this.apiProductSearch();
    this.apiPromotionSearch();

    // Servicios
    // this.subscription.add(
    //   this._serviceService.listObserver$
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: ServiceList[]) => {
    //     this.lists = list;
    //   })
    // );

    // Tipo de servicios
    // this.subscription.add(
    //   this._typeServiceService.listObserver$
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: TypeServiceList[]) => {
    //     this.listTypeServices = list;
    //   })
    // );

    // Productos
    // this.subscription.add(
    //   this._productService.listObserver$
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: ProductList[]) => {
    //     this.listProducts = list;
    //   })
    // );

    // Promociones
    // this.subscription.add(
    //   this._promotionService.listObserver$
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: PromotionList[]) => {
    //     this.listPromotions = list;
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
    this._serviceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Service){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._serviceService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: ServiceList = ServiceList.cast(response.data[0]);
            this._serviceService.addObjectObserver(data);
          }

          this.apiServiceListPagination();
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

  private updateDataApi(data: Service, id: number){
    this._sweetAlertService.loadingUp()
    this._serviceService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: ServiceList = ServiceList.cast(response.data[0]);
        this._serviceService.updateObjectObserver(data);
        this.modalRef?.hide();
        this.apiServiceListPagination();

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
    this._serviceService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: ServiceList = ServiceList.cast(response.data[0]);
        this._serviceService.removeObjectObserver(data.id);
        this.apiServiceListPagination();

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
  apiServiceListPagination(): void {
    this.subscription.add(
      this._serviceService.getPagination({
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar servicios', message: error.message, timer: 2500});
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
      this.apiServiceListPagination();
    }, 0);
  }
    

  /**
   * *************************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *************************************************************
   */
  // Tipo servicios
  public apiTypeServiceList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeServiceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listTypeServices = response.data;
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
  
  public apiTypeServiceSearch(search: string = ''){
    this._typeServiceService.getSearch({search}).subscribe((response: ResponseApi) => {
      if(response.code == 200){
        this.listTypeServices = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  // Productos
  public apiProductList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._productService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listProducts = response.data;
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

  public apiProductSearch(search: string = ''){
    this._productService.getSearch({search}).subscribe((response: ResponseApi) => {
      if(response.code == 200){
        this.listProducts = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  onSelectProductSearched(selectedItem: any) {
    if(selectedItem){
      this.form.nombre.setValue(selectedItem.nombre);
    } else {
      this.form.nombre.setValue('');
    }
  }

  // Promociones
  public apiPromotionList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._promotionService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listPromotions = response.data;
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

  public apiPromotionSearch(search: string = ''){
    this._promotionService.getSearch({search}).subscribe((response: ResponseApi) => {
      if(response.code == 200){
        this.listPromotions = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      console.log(error);
    });
  }




  /**
   * Form data get
   */
  get form() {
    return this.serviceForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const service = new Service();
    const formGroupData = this.getFormGroupData(service);
    this.serviceForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Service): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo_servicios_id: ['', [Validators.required, Validators.min(1)]],
      productos_id: ['', [Validators.required, Validators.min(1)]],
      promociones_id: [undefined, [Validators.nullValidator, Validators.min(1)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(150)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }


  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear tipo de servicio';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.serviceForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Service = this.serviceForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el servicio?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el servicio?').then((confirm) => {
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
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.dataModal.title = 'Editar tipo de servicio';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const service = Service.cast(data);
    this.serviceForm = this.formBuilder.group({...this._formService.modelToFormGroupData(service), id: [data.id]});
    this.apiTypeServiceSearch(data.tipo_servicios_nombre);
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el servicio?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
