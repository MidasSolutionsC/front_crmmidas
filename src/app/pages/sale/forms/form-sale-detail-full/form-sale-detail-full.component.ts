import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BrandList, ResponseApi, SaleDetail, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, BrandService, FormService, SharedSaleService, SweetAlertService, TempSaleDetailService, TypeServiceService } from 'src/app/core/services';

@Component({
  selector: 'app-form-sale-detail-full',
  templateUrl: './form-sale-detail-full.component.html',
  styleUrls: ['./form-sale-detail-full.component.scss']
})
export class FormSaleDetailFullComponent implements OnInit, OnDestroy, OnChanges{

  // DATOS DE ENTRADA
  // LISTA DE MARCAS (COMPAÑAS)
  @Input() dataEdit: SaleDetail = null;
  @Input() listBrand: BrandList[] = [];
  @Input() typeServiceId: any = '';
  @Input() typeServiceIcon: string = '';
  @Input() typeServiceNombre: string = '';
  @Input() shareTypeService: string = null;

  @Output() cancel = new EventEmitter<any>();

  // Datos de la venta
  dataBasicPreview: any = {
    fecha: '11-10-2023',
    smart_id: '',
    smart_address_id: '',
    address: ''
  };

  // MOSTRAR FORMULARIO PARA INDICAR EL SERVICIO AÑADIR
  showFormIndicationService: boolean = false;

  // MOSTRAR FORMULARIO DE SERVICIO
  showFormService: boolean = true;

  // VALOR COMPARTIDO
  // shareTypeService: string = null;
  
  // ID TIPO DE SERVICIO
  // typeServiceId: any = '';
  // typeServiceIcon: string = '';
  // typeServiceNombre: string = '';

  // ID MARCA
  brandId: any = '';


  // Lista de tipo de servicios
  listTypeService: TypeServiceList[] = [];


  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _typeServiceService: TypeServiceService,
    private _brandService: BrandService,
    private _sharedSaleService: SharedSaleService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    
    this.apiTypeServiceList();

    // TIPO DE SERVICIOS
    this.subscription.add(
      this._typeServiceService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeServiceList[]) => {
        this.listTypeService = list;
      })
    ); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes.shareTypeService.firstChange){

    // }
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
      this.typeServiceIcon = typeService.icono;
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
   * EVENTOS DEL FORMULARIO DETALLE - EMITIR CAMBIO
   * ***********************************************************
   */
  onCancel(event: any){
    this.cancel.emit({message: 'Cancelado'});
  }

  // DATOS SERVICIO
  onDataTypeService(event: any){
    if(event.data){
      this.typeServiceIcon = event.data.icono;
      this.typeServiceNombre = event.data.nombre;
    }
  }
}
