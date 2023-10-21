import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BrandList, ResponseApi, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, BrandService, FormService, SharedSaleService, SweetAlertService, TempSaleDetailService, TypeServiceService } from 'src/app/core/services';

@Component({
  selector: 'app-form-sale-detail-full',
  templateUrl: './form-sale-detail-full.component.html',
  styleUrls: ['./form-sale-detail-full.component.scss']
})
export class FormSaleDetailFullComponent implements OnInit, OnDestroy{

  // Datos de la venta
  dataBasicPreview: any = {
    fecha: '11-10-2023',
    smart_id: '',
    smart_address_id: '',
    address: ''
  };

  // MOSTRAR FORMULARIO PARA INDICAR EL SERVICIO AÑADIR
  showFormIndicationService: boolean = true;

  // MOSTRAR FORMULARIO DE SERVICIO
  showFormService: boolean = false;

  // VALOR COMPARTIDO
  shareTypeService: string = null;
  
  // ID TIPO DE SERVICIO
  typeServiceId: any = '';
  typeServiceNombre: string = '';

  // ID MARCA
  brandId: any = '';


  // Lista de tipo de servicios
  listTypeService: TypeServiceList[] = [];

  // LISTA DE MARCAS (COMPAÑAS)
  listBrand: BrandList[] = [];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _typeServiceService: TypeServiceService,
    private _brandService: BrandService,
    private _sharedSaleService: SharedSaleService,
    private _tempSaleDetailService: TempSaleDetailService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    
    this.apiTypeServiceList();
    this.apiBrandList();

    // TIPO DE SERVICIOS
    this.subscription.add(
      this._typeServiceService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeServiceList[]) => {
        this.listTypeService = list;
      })
    ); 

    // MARCAS
    this.subscription.add(
      this._brandService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: BrandList[]) => {
        this.listBrand = list;
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
  // Listar tipo de servicios
  public apiTypeServiceList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeServiceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.lists = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar tipos de servicios', message: error.message, timer: 2500});
      }
    });
  }

  // Listar marcas
  public apiBrandList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._brandService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.lists = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar las marcas', message: error.message, timer: 2500});
      }
    });
  }


  /** 
   * ***********************************************************
   * DATOS RECIBIDO DEL FORMULARIO - FORM SALE DETAIL
   * ***********************************************************
  */
  onDataSaleDetail(data: any){
    // console.log("DATOS RECIBIDO EN DETAIL FULL:", data);
  }



  /**
   * ****************************************************************
   * SERVICIO SELECCIONADO - MOSTRAR FORMULARIO
   * ****************************************************************
   */
  openFormService(){
    if(!this.typeServiceId){
      this._sweetAlertService.showCenter({type: 'warning', title: 'Error al agregar servicio', message: 'Por favor indique el tipo de servicio', timer: 2500});
    } else {
      this.showFormIndicationService = false;
      this.showFormService = true;
      const typeService = this.listTypeService.find((item) => item.id == this.typeServiceId);
      this.typeServiceNombre = typeService.nombre;
      this._sharedSaleService.setTypeServiceId(this.typeServiceId);

      if(typeService.nombre.toLowerCase().includes('movil')){
        this.shareTypeService = 'mobile';
      } else if (typeService.nombre.toLowerCase().includes('fija')){
        this.shareTypeService = 'fixed';
      } else if(typeService.nombre.toLowerCase().includes('tv')){
        this.shareTypeService = 'tv';
      }
    }

  }

  /**
   * ***********************************************************
   * EVENTOS DEL FORMULARIO DETALLE
   * ***********************************************************
   */
  onCancel(event: any){
    // console.log(event);
    this.showFormService = false;
    this.showFormIndicationService = true;
  }
}
