import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { BrandList, Breadcrumb, CategoryList, TypeCurrencyList, Pagination, Product, ProductList, ResponseApi, ResponsePagination, TypeServiceList, PaginationResult } from 'src/app/core/models';
import { ApiErrorFormattingService, BrandService, CategoryService, TypeCurrencyService, FormService, ProductService, SweetAlertService, TypeServiceService } from 'src/app/core/services';
import { CleanObject } from 'src/app/core/helpers/clean-object.util';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear producto',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Productos';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  productForm: FormGroup;

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

  // VALIDAR SI ES PRODUCTO FÍSICO O SERVICIO
  isInfoProduct: boolean = true;

  // Table data
  // content?: any;
  lists?: ProductList[] = [];

  // Tipo de servicios;
  listServices?: TypeServiceList[];

  // Categorías
  listCategories: CategoryList[] = [];

  // Marcas
  listBrands: BrandList[] = [];

  // Divisas
  listCurrencies: TypeCurrencyList[] = [];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService, 
    private _categoryService: CategoryService,
    private _brandService: BrandService,
    private _typeCurrencyService: TypeCurrencyService,
    private _typeServiceService: TypeServiceService,
    private _productService: ProductService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'},{ label: 'Productos', active: true }]);

    this.initForm();
    // this.listDataApi();
    this.apiTypeServiceList();
    this.apiCategoryList();
    this.apiBrandList();
    this.apiTypeCurrencyList();

    this.apiProductListPagination();

    // Productos
    // this.subscription.add(
    //   this._productService.listObserver$
    //   // .pipe(distinctUntilChanged())
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: ProductList[]) => {
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

    // Categorías
    this.subscription.add(
      this._categoryService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: CategoryList[]) => {
        this.listCategories = list;
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

    // EMIT CONSULTA PAGINACIÓN
    this.subscription.add(
    this.pagination.asObservable()
      .subscribe((pagination: Pagination) => {
        this.apiProductListPagination()
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
    this._productService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Product){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._productService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data){
            const {product, productPrice} = response.data;
            if(product){
              const data: ProductList = ProductList.cast(product);
              this._productService.addObjectObserver(data);
            }

          }

          this.apiProductListPagination();
          this.modalRef?.hide();
        }

        if(response.code == 422){
          if(response.errors){
            const {product_errors, price_errors} = response.errors;
            let textErrors = '';

            if(product_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(product_errors);
            }

            if(price_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(price_errors);
            }

            if(textErrors != ''){
              this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            }
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

  private updateDataApi(data: Product, id: number){
    this._sweetAlertService.loadingUp()
    this._productService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 201){
        // const data: ProductList = ProductList.cast(response.data[0]);
        // this._productService.updateObjectObserver(data);
        
        if(response.data){
          const {product, productPrice} = response.data;
          if(product){
            const data: ProductList = ProductList.cast(product);
            this._productService.updateObjectObserver(data);
          }
        }

        this.apiProductListPagination();
        this.modalRef?.hide();
      }

      if(response.code == 422){
        const {product_errors, price_errors} = response.errors;
        let textErrors = '';

        if(product_errors){
          textErrors += this._apiErrorFormattingService.formatAsHtml(product_errors);
        }

        if(price_errors){
          textErrors += this._apiErrorFormattingService.formatAsHtml(price_errors);
        }

        if(textErrors != ''){
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
    this._productService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: ProductList = ProductList.cast(response.data[0]);
        this._productService.removeObjectObserver(data.id);
        this.apiProductListPagination();
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
  public apiProductListPagination(): void {
    this.subscription.add(
      this._productService.getPagination(this.pagination.getValue())
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
            this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar productos', message: error.message, timer: 2500 });
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
   * *************************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *************************************************************
   */
  // Tipo documento
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

  // Categorías
  public apiCategoryList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._categoryService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listCategories = response.data;
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
        this.listBrands = response.data;
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
    return this.productForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const product = new Product();
    const formGroupData = this.getFormGroupData(product);
    this.productForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Product): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: [model?.nombre || '', [Validators.required, Validators.maxLength(50)]],
      descripcion: [model?.descripcion || '', [Validators.nullValidator, Validators.maxLength(450)]],
      especificaciones: [model?.especificaciones || '', [Validators.nullValidator, Validators.maxLength(450)]],
      is_info_producto: [true, [Validators.required]],
      tipo_producto: [model?.tipo_producto || 'S', []],
      tipo_servicios_id: [model?.tipo_servicios_id || '', [Validators.required, Validators.min(1)]],
      categorias_id: [model?.categorias_id || '', [Validators.nullValidator, Validators.min(1)]],
      marcas_id: [model?.marcas_id || '', [Validators.nullValidator, Validators.min(1)]],
      tipo_monedas_id: [model?.tipo_monedas_id || '', [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.nullValidator, Validators.min(0)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }


  // CAMBIAR TIPO DE PRODUCTO
  onChangeTypeProduct(isInfoProduct: any){
      const controlTypeService = this.productForm.get('tipo_servicios_id');

    if (isInfoProduct) {
      // Agregar validación "required" si no es producto físico
      this.productForm.get('tipo_producto').setValue('S');
      controlTypeService.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // Quitar la validación "required" si es producto físico
      this.productForm.get('tipo_producto').setValue('F');
      controlTypeService.clearValidators();
    }

    // Actualizar el control y marcarlo como "tocado" para forzar la validación
    controlTypeService.updateValueAndValidity();
  }


  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isInfoProduct = true;
    this.isNewData = true;
    this.dataModal.title = 'Crear producto';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.productForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      let values: any = this.productForm.value;
      values = CleanObject.assignNullFields(values);

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el producto?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el producto?').then((confirm) => {
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
    this.dataModal.title = 'Editar producto';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const product = Product.cast(data);
    // this.productForm.setValue(Product.cast(data));
    if(product.tipo_producto == 'S'){
      this.isInfoProduct = true;
    } else {
      this.isInfoProduct = false;
    }

    this.productForm = this.formBuilder.group({...this._formService.modelToFormGroupData(product), is_info_producto: product.tipo_producto == 'S'? true: false, id: [data.id]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el producto?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
