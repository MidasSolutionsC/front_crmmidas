import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { BrandList, Breadcrumb, Pagination, PaginationResult, Promotion, PromotionList, ResponseApi, ResponsePagination, TypeCurrencyList, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, BrandService, FormService, PromotionService, SweetAlertService, TypeCurrencyService, TypeServiceService } from 'src/app/core/services';
import { CleanObject } from 'src/app/core/helpers/clean-object.util';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit, OnDestroy{
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear promoción',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Promociones';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  promotionForm: FormGroup;

  
  // TABLE SERVER SIDE
  page: number = 1;
  perPage: number = 5;
  search: string = '';
  column: string = '';
  order: 'asc' | 'desc' = 'desc';
  countElements: number[] = [5, 10, 25, 50, 100];
  total: number = 0;
  pagination: PaginationResult = new PaginationResult();

  // VALIDAR SI ES PRODUCTO FÍSICO O SERVICIO
  isInfoProduct: boolean = true;

  showDiscount: boolean = false;
  showCodeMinMax: boolean = false;
  showDates: boolean = false;

  // Table data
  // content?: any;
  lists?: PromotionList[] = [];

  // Tipo de servicios;
  listServices?: TypeServiceList[];
  
  // Marcas
  listBrands: BrandList[] = [];

  // Divisas
  listCurrencies: TypeCurrencyList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService, 
    private _brandService: BrandService,
    private _typeCurrencyService: TypeCurrencyService,
    private _typeServiceService: TypeServiceService,
    private _promotionService: PromotionService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'},{ label: 'Promociones', active: true }]);

    this.initForm();
    this.listDataApi();
    // this.apiTypeServiceList();
    this.apiTypeServiceList();
    this.apiBrandList();
    this.apiTypeCurrencyList();
    this.apiPromotionListPagination();

    // Promociones
    // this.subscription.add(
    //   this._promotionService.listObserver$
    //   // .pipe(distinctUntilChanged())
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: PromotionList[]) => {
    //     this.lists = list;
    //   })
    // );

    // Tipo de servicios
    this.subscription.add(
      this._typeServiceService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeServiceList[]) => {
        this.listServices = list;
      })
    );


    // Marcas
    this.subscription.add(
      this._brandService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: BrandList[]) => {
        this.listBrands = list;
      })
    );

    // Divisas
    this.subscription.add(
      this._typeCurrencyService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeCurrencyList[]) => {
        this.listCurrencies = list;
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
    this._promotionService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Promotion){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._promotionService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: PromotionList = PromotionList.cast(response.data[0]);
            this._promotionService.addObjectObserver(data);
          }

          this.apiPromotionListPagination();
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

  private updateDataApi(data: Promotion, id: number){
    this._sweetAlertService.loadingUp()
    this._promotionService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: PromotionList = PromotionList.cast(response.data[0]);
        this._promotionService.updateObjectObserver(data);

        this.apiPromotionListPagination();
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
    this._promotionService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: PromotionList = PromotionList.cast(response.data[0]);
        this._promotionService.removeObjectObserver(data.id);
        this.apiPromotionListPagination();
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
  apiPromotionListPagination(): void {
    this.subscription.add(
      this._promotionService.getPagination({
        page: this.page.toString(),
        perPage: this.perPage.toString(),
        search: this.search,
        column: this.column,
        order: this.order
      })
      .pipe(debounceTime(250))
      .subscribe((response: ResponsePagination) => {
        if(response.code == 200){
          this.pagination = PaginationResult.cast(response.data);
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
      this.apiPromotionListPagination();
    }, 0);
  }

  getPageRefresh(){
    this.page = 1;
    this.perPage = 10;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiPromotionListPagination();
    }, 0);
  }


  
  /**
   * *******************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *******************************************************
   */
  // Tipo servicios
  public apiTypeServiceList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeServiceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listServices = response.data;
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

  // Marcas
  public apiBrandList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._brandService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listBrands = response.data;
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

  // Divisas
  public apiTypeCurrencyList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeCurrencyService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listCurrencies = response.data;
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
    return this.promotionForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const promotion = new Promotion();
    const formGroupData = this.getFormGroupData(promotion);
    this.promotionForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Promotion): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: [model.nombre || '', [Validators.required, Validators.maxLength(50)]],
      descripcion: [model.descripcion || '', [Validators.nullValidator, Validators.maxLength(150)]],
      is_info_producto: [true, [Validators.required]],
      tipo_producto: [model?.tipo_producto || 'S', []],
      tipo_servicios_id: [model.tipo_servicios_id || '', [Validators.required, Validators.min(1)]],
      marcas_id: [model?.marcas_id || '', [Validators.nullValidator, Validators.min(1)]],
      tipo_descuento: [model.tipo_descuento || 'P', [Validators.nullValidator]],
      tipo_monedas_id: [model?.tipo_monedas_id || '', [Validators.nullValidator, Validators.min(1)]],
      descuento: [model.descuento || 0, [Validators.nullValidator, Validators.min(0)]],
      fecha_inicio: [new Date().toISOString().split('T')[0], [Validators.required]],
      fecha_fin: [model.fecha_fin || null, [Validators.nullValidator]],
      is_private: [model.is_private || false, [Validators.nullValidator]],
      is_active: [true, [Validators.nullValidator]],
      show_discount: [this.showDiscount, [Validators.nullValidator]],
      show_code_min_max: [this.showCodeMinMax, [Validators.nullValidator]],
      show_dates: [this.showDates, [Validators.nullValidator]],
    }
  }

  // CAMBIAR TIPO DE PRODUCTO
  onChangeTypeProduct(isInfoProduct: any){
    const controlTypeService = this.promotionForm.get('tipo_servicios_id');

    if (isInfoProduct) {
      // Agregar validación "required" si no es producto físico
      this.promotionForm.get('tipo_producto').setValue('S');
      controlTypeService.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // Quitar la validación "required" si es producto físico
      this.promotionForm.get('tipo_producto').setValue('F');
      controlTypeService.clearValidators();
    }

    // Actualizar el control y marcarlo como "tocado" para forzar la validación
    controlTypeService.updateValueAndValidity();
  }

  // CAMBIAR TIPO DE DESCUENTO
  onChangeTypeDiscount(value: 'C' | 'P'){
    const controlTypeCurrency = this.promotionForm.get('tipo_monedas_id');
    console.log(value)

    if (value == 'C') {
      // Agregar validación "required"
      controlTypeCurrency.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // Quitar la validación "required"
      controlTypeCurrency.clearValidators();
    }

    // Actualizar el control y marcarlo como "tocado" para forzar la validación
    controlTypeCurrency.updateValueAndValidity();
  }



  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isInfoProduct = true;
    this.isNewData = true;
    this.dataModal.title = 'Crear promoción';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.promotionForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      let values: any = this.promotionForm.value;
      values = CleanObject.assignNullFields(values);

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la promoción?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la promoción?').then((confirm) => {
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
    this.dataModal.title = 'Editar promoción';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const promotion = Promotion.cast(data);

    this.isInfoProduct = promotion.tipo_producto == 'S'? true: false;

    this.promotionForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(promotion), 
      id: [data.id], 
      is_info_producto: promotion.tipo_producto == 'S'? true: false,
      show_discount: [this.showDiscount, [Validators.nullValidator]],
      show_code_min_max: [this.showCodeMinMax, [Validators.nullValidator]],
      show_dates: [this.showDates, [Validators.nullValidator]],
    });
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la promoción?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
