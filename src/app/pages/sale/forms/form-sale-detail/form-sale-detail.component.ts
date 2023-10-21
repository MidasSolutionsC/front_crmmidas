import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged, filter } from 'rxjs';
import { Company, DetailFixedLine, DetailMobileLine, InstallationList, OperatorList, Person, ProductList, PromotionList, ResponseApi, SaleDetail, TypeDocumentList, TypeStatusList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, OperatorService, ProductService, PromotionService, SharedClientService, SharedSaleService, SweetAlertService, TempInstallationService, TempSaleDetailService, TypeDocumentService, TypeStatusService } from 'src/app/core/services';

import { FormMobileComponent } from './form-mobile/form-mobile.component';
import { FormFixedComponent } from './form-fixed/form-fixed.component';
import { FormTvComponent } from './form-tv/form-tv.component';
import { Client } from 'src/app/core/models/api/client.model';

@Component({
  selector: 'app-form-sale-detail',
  templateUrl: './form-sale-detail.component.html',
  styleUrls: ['./form-sale-detail.component.scss']
})
export class FormSaleDetailComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('mobileForm') mobileForm!: FormMobileComponent;
  @ViewChild('fixedForm') fixedForm!: FormFixedComponent;
  @ViewChild('tvForm') tvForm!: FormTvComponent;

  // Datos de entrada
  @Input() typeService: string = null;
  @Input() data: SaleDetail = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // DETALLE SERVICIO
  isNewData: boolean = true;
  submitted: boolean = false;
  saleDetailForm: FormGroup;

  // VENTAS ID
  saleId: number = null;
  installationId: number = null;

  // MARCAS ID
  brandId: any = '';

  // TIPO DE SERVICIO ID
  typeServiceId: any = '';

  // TIPO PRODUCTO
  typeProduct: any = '';

  // ENFOQUES
  focusTypeDocumentMobile: boolean = false;

  // FORM LINEA FIJA
  fixedLineForm: FormGroup;
  
  // FORM LINEA MOVIL
  mobileLineForm: FormGroup;
  
  // FORM LINEA TV
  tvLineForm: FormGroup;

  // Tipo documentos
  listTypeDocuments?: TypeDocumentList[] = [];

  // Tipo de servicios;
  listTypeStatus?: TypeStatusList[];
  
  // Operadores;
  listOperators?: OperatorList[] = [];
  
  // Productos;
  selectedProduct: ProductList;
  listProducts?: ProductList[] = [];

  // Promociones
  selectedPromotion: PromotionList;
  listPromotions?: PromotionList[] = [];

  // Lista de instalaciones
  tmpListInstallationOptions: InstallationList[] = [];

  // CLIENTE ACTIVO
  dataClient: Client;
  dataPerson: Person;
  dataCompany: Company;

  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _tempInstallationService: TempInstallationService,
    private _tempSaleDetailService: TempSaleDetailService,
    private _operatorService: OperatorService,
    private _typeStatusService: TypeStatusService,
    private _typeDocumentService: TypeDocumentService,
    private _productService: ProductService,
    private _promotionService: PromotionService,
    private _sharedSaleService: SharedSaleService,
    private _sharedClientService: SharedClientService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){
  }


  ngOnInit(): void {
    // INSTANCIA DEL FORMULARIOS
    this.initForm();

    // Listar los tipos de documentos
    this.apiTypeDocumentList();
    this.apiTypeStatusList();
    this.apiOperatorList();
    this.apiProductGetSearch('');
    this.apiPromotionGetSearch('');

    // Tipo de documentos  observado
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(
        distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
            )
          )
          .subscribe((list: TypeDocumentList[]) => {
            this.listTypeDocuments = list;
      })
    );

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

    // VENTA ID
    this.subscription.add(
      this._sharedSaleService.getSaleId()
      .pipe(filter((value) => value != null))
      .subscribe((value: number) => {
        this.saleId = value;
      })
    );

    // INSTALACIÓN ID
    this.subscription.add(
      this._sharedSaleService.getInstallationId()
      .pipe(filter((value) => value != null))
      .subscribe((value: number) => {
        this.installationId = value;
      })
    );

    // MARCAS ID
    this.subscription.add(
      this._sharedSaleService.getBrandId()
      .pipe(filter((value) => value != null))
      .subscribe((value: number) => {
        this.brandId = value;
        this.onResetSelectedProductAndPromotion();
      })
    );

    // TIPO DE SERVICIO ID
    this.subscription.add(
      this._sharedSaleService.getTypeServiceId()
      .pipe(filter((value) => value != null))
      .subscribe((value: number) => {
        this.typeServiceId = value;
        this.onResetSelectedProductAndPromotion();
      })
    );

    // TIPO DE SERVICIO ID
    this.subscription.add(
      this._sharedSaleService.getTypeProduct()
      .pipe(filter((value) => value != null))
      .subscribe((value: string) => {
        this.typeProduct = value;
        this.onResetSelectedProductAndPromotion();
      })
    );

    // CLIENTE
    // this.subscription.add(
    //   this._sharedClientService.getDataClient()
    //   .pipe(filter((value) => value != null))
    //   .subscribe((data: Client) => {
    //     this.dataClient = data;
    //     console.log("DATOS DEL CLIENTE:", data);
    //   })
    // );

    // PERSONA
    // this.subscription.add(
    //   this._sharedClientService.getDataPerson()
    //   .pipe(filter((value) => value != null))
    //   .subscribe((data: Person) => {
    //     this.dataPerson = data;
    //     console.log("DATOS DEL persona:", data);
    //   })
    // );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  
  ngOnChanges(changes: SimpleChanges) { 
    if((changes.data && !changes.data.firstChange) || (changes.typeService && !changes.typeService.firstChange)){
      setTimeout(() => {
        this.initializeForms();
      }, 0);
    }   
  }


  initializeForms(){
    if(this.data){
      this.apiTempInstallationSearch(''); // Filtrar direcciones
      if(this.saleDetailForm){
        this.saleDetailForm.setValue(SaleDetail.cast(this.data));
      }
    } else {
      this.data = null;
      if(this.saleDetailForm){
        this.saleDetailForm.reset();
      }

      if(this.mobileLineForm){
        this.mobileLineForm.reset();
      }

      if(this.fixedLineForm){
        this.fixedLineForm.reset();
      }
    }

    if(this.typeService){
      const json = this.data?.datos_json && JSON.stringify(this.data?.datos_json) !== '{}'? this.data.datos_json: null;
      console.log(json)

      switch(this.typeService){
        case 'mobile':
          if(json != null){
            const value = DetailMobileLine.cast(json);
            if(this.mobileLineForm){
              this.mobileLineForm.setValue(value);          
            }
          }
          break;
        case 'fixed':
          if(json != null){
            const value = DetailFixedLine.cast(json);
            if(this.fixedLineForm){
              this.fixedLineForm.setValue(value);          
            }
          }
          break;
        case 'tv':
          // this.initFormTv();
          break;

        default: break;
      }
    }
  }

  
  /**
   * ****************************************************************
   * RESPETAR PRODUCTO Y PROMOCIÓN SELECCIONADO
   * ****************************************************************
   */
  onResetSelectedProductAndPromotion(){
    this.saleDetailForm.get('productos_id').setValue(null);
    this.saleDetailForm.get('promociones_id').setValue(null);
    this.selectedProduct = null;
    this.selectedPromotion = null;
    this.apiProductGetSearch('');
    this.apiPromotionGetSearch('');
  }

  


  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  // Registrar detalle
  private apiTempSaleDetailRegister(data: SaleDetail){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempSaleDetailService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          const result = response.data;
          // console.log(result);

        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            // const {installation_errors, sale_detail_errors, sale_errors} = response.errors;
            // let textErrors = '';

            // if(installation_errors){
            //   textErrors += this._apiErrorFormattingService.formatAsHtml(installation_errors);
            // }

            // if(sale_detail_errors){
            //   textErrors += this._apiErrorFormattingService.formatAsHtml(sale_detail_errors);
            // }

            // if(sale_errors){
            //   textErrors += this._apiErrorFormattingService.formatAsHtml(sale_errors);
            // }

            // if(textErrors != ''){
            //   this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            // }
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar el detalle', message: error.message, timer: 2500});
        }
      })
    )
  }
  
  // modificar detalle
  private apiTempSaleDetailUpdate(data: SaleDetail, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempSaleDetailService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          const result = response.data;
          // console.log(result);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar los datos del detalle', message: error.message, timer: 2500});
        }
      })
    )
  }


  /**
   * *******************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *******************************************************
   */
  // Tipo documento
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeDocuments = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tips de documentos', message: error.message, timer: 2500});
      }
    });
  }
  
  // Tipo documento
  public apiTypeStatusList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeStatusService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeStatus = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tipos de estados', message: error.message, timer: 2500});
      }
    });
  }

  // Operadores
  public apiOperatorList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._operatorService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listOperators = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los operadores', message: error.message, timer: 2500});
      }
    });
  }

  // Buscar instalaciones
  public apiTempInstallationSearch(search: string) {
    this._tempInstallationService.getSearch({search, ventas_id: this.data?.ventas_id}).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.tmpListInstallationOptions = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las instalación', message: error.message, timer: 2500});
      }
    });
  }

  // Buscar productos
  public apiProductGetSearch(search: string) {
    this._productService.getSearch({
        search, 
        marcas_id: this.brandId, 
        tipo_servicios_id: this.typeServiceId,
        tipo_producto: this.typeProduct
      }).subscribe((response: ResponseApi) => {
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
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar los productos', message: error.message, timer: 2500});
      }
    });
  }

  // Buscar promociones
  public apiPromotionGetSearch(search: string) {
    this._promotionService.getSearch({
        search, 
        marcas_id: this.brandId, 
        tipo_servicios_id: this.typeServiceId,
        tipo_producto: this.typeProduct
      }).subscribe((response: ResponseApi) => {
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
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar las promociones', message: error.message, timer: 2500});
      }
    });
  }

  
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - DETALLE
   * ***********************************************
   */
  get f() {
    return this.saleDetailForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: SaleDetail = new SaleDetail()){
    const formGroupData = this.getFormGroupData(model);
    this.saleDetailForm = this.formBuilder.group(formGroupData);
    // this.saleDetailForm.get('is_other').value
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: SaleDetail): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      // tipo_estados_id: [model.tipo_estados_id, [Validators.required, Validators.min(1)]],
      productos_id: [model.productos_id, [Validators.required, Validators.min(1)]],
      promociones_id: [model.promociones_id, [Validators.nullValidator, Validators.min(1)]],
      fecha_cierre: [model.fecha_cierre, [Validators.nullValidator]],
      observacion: [model.observacion, [Validators.nullValidator, Validators.maxLength(450)]],
      is_active: [true, [Validators.nullValidator]],
      is_other_address: [false, [Validators.nullValidator]],
    }
  }


  // SELECTED PRODUCT
  onChangeSelectedProduct(product: ProductList){
    if(product){
      this.selectedProduct = product;
    } else {
      this.selectedProduct = null;
    }
  }

  // SELECTED PROMOTION
  onChangeSelectedPromotion(promotion: PromotionList){
    if(promotion){
      this.selectedPromotion = promotion;
    } else {
      this.selectedPromotion = null;
    }
  }



  /**
   * ***********************************************
   * EMITIR VALOREES
   * ***********************************************
   */
  onSubmit() {
    // Emitir un evento cuando se envía el formulario
    this.submitted = true;
    let data = null;

    if(this.typeService){
      switch(this.typeService){
        case 'mobile':
          data = this.submitMobile();
          break;
        case 'fixed':
          data = this.submitFixed();
          break;
        case 'tv':
          // data = this.submitTv();
          break;

        default: break;
      }
    }

    
    if(this.saleDetailForm.invalid || !data){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      this.f.datos_json.setValue(data);
      const values = SaleDetail.cast(this.saleDetailForm.value);

      if(this.saleId){
        values.ventas_id = this.saleId;
      }

      if(this.installationId){
        values.instalaciones_id = this.installationId;
      }
      // this.submit.emit(values);

      if(this.isNewData){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el producto/servicio?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiTempSaleDetailRegister(values);
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar el producto/servicio?').then((confirm) => {
          if(confirm.isConfirmed){
            // this.apiTempSaleDetailUpdate(values, values.id);
          }
        });
      }
    }
  }
  
  

  // Tv
  submitTv(){
    if(this.tvLineForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return false;
    } else {
      // this.submit.emit(this.tvLineForm.value);
      return this.tvLineForm.value;
    }
  }

  // Mobile
  submitMobile(){
    if(this.mobileForm.mobileLineForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return false;
    } else {
      // this.submit.emit(this.mobileLineForm.value);
      return this.mobileForm.mobileLineForm.value;
    }
  }

  // Fija
  submitFixed(){
    if(this.fixedForm.fixedLineForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return false;
    } else {
      // this.submit.emit(this.fixedLineForm.value);
      return this.fixedForm.fixedLineForm.value;
    }
  }

  /**
   * ***********************************************
   * EMITIR VALOREES CANCELADO
   * ***********************************************
   */
  onCancel(){
    this.submitted = false;
    this.cancel.emit({message: 'Cancelado'});
  }

}
