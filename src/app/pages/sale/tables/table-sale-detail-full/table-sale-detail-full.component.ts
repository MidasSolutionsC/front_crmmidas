import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { CurrencyUtil } from 'src/app/core/helpers/currency.util';
import { BrandList, Installation, InstallationList, ResponseApi, SaleDetailList } from 'src/app/core/models';
import { ApiErrorFormattingService, BrandService, SaleDetailService, SharedSaleService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-table-sale-detail-full',
  templateUrl: './table-sale-detail-full.component.html',
  styleUrls: ['./table-sale-detail-full.component.scss']
})
export class TableSaleDetailFullComponent implements OnInit, OnDestroy {
  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  //
  isInfoProduct: boolean = true;

  // TITULO DEL CARD
  title: string = 'Productos/Servicio';

  // Datos de la venta
  dataBasicPreview = {
    fecha: 'S/N',
    smart_id: '',
    smart_address_id: '',
    address: 'S/N'
  };


  // DATOS INSTALACIÓN
  dataInstallation: Installation;

  // TIPO DE PRODUCTO
  typeProduct: any = '';

  // ID VENTA
  saleId: number;

  // ID MARCA
  brandId: any = '';
  
  // IDS ADICIONALES DE LA VENTA
  retailxId: any = '';
  smartId: any = '';
  smartAddressId: any = '';

  // LISTA DE MARCAS (COMPAÑAS)
  listBrand: BrandList[] = [];

  // LISTA DE SERVICIOS AÑADIDOS A LA VENTA
  listSaleDetail: SaleDetailList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private _brandService: BrandService,
    private _sharedSaleService: SharedSaleService,
    private _saleDetailService: SaleDetailService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.apiBrandList();

    // MARCAS
    this.subscription.add(
      this._brandService.listObserver$
        .subscribe((list: BrandList[]) => {
          this.listBrand = list;
        })
    );

    // DIRECCIÓN
    this.subscription.add(
      this._sharedSaleService.getDataInstallation()
        .pipe(filter((data) => data != null))
        .subscribe((data: InstallationList) => {
          const direccion_completo = `
            ${data.tipo} 
            ${data.direccion} 
            ${data.numero != '' ? ', ' + data.numero : ''} 
            ${data.escalera != '' ? ', ' + data.escalera : ''} 
            ${data.portal != '' ? ', ' + data.portal : ''} 
            ${data.planta != '' ? ', ' + data.planta : ''} 
            ${data.puerta != '' ? ', ' + data.puerta : ''}
          `;

          // this.dataBasicPreview.fecha = new Date().toLocaleString();
          this.dataBasicPreview.fecha = data.created_at;
          this.dataBasicPreview.address = direccion_completo;
          this.dataInstallation = data;
        })
    );

    // ID VENTA
    this.subscription.add(
      this._sharedSaleService.getSaleId().pipe(filter((value) => value !== null)).subscribe((id: number) => {
          this.saleId = id;
          this.apiSaleDetailListBySale(id);
        })
    );

    // DETALLE
    this.subscription.add(
      this._saleDetailService.listObserver$.subscribe((list: SaleDetailList[]) => {
          this.listSaleDetail = list;
          console.log("LISTA DE SERVICIOS/PRODUCTOS:", list)
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  // CONVERTIDOR DE MONEDAS
  public convertCurrencyFormat(amount: number, currency: string, format: string = 'en-US') {
    return CurrencyUtil.convertCurrencyFormat(amount, currency, format);
  }
  


  /**
   * ****************************************************************
   * ABRIR FORMULARIO 
   * ****************************************************************
   */
  toggleForm(collapse: boolean = null) {
    this.isCollapseForm = collapse || !this.isCollapseForm;
    if (!this.isCollapseForm) {
      this.isCollapseList = true;
    } else {
      this.isCollapseList = false;
    }
  }



  /** 
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  // Listar marcas 
  public apiSaleDetailListBySale(saleId: number = this.saleId) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDetailService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        // this.lists = response.data;
        this._saleDetailService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar los productos/servicios', message: error.message, timer: 2500 });
      }
    });
  }

  // Listar marcas 
  public apiBrandList(forceRefresh: boolean = false) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._brandService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        // this.lists = response.data;
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar las marcas', message: error.message, timer: 2500 });
      }
    });
  }

  // ELIMINAR DETALLE
  public apiSaleDetailDelete(id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDetailService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleDetailList = SaleDetailList.cast(response.data[0]);
        this._saleDetailService.removeObjectObserver(data.id);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar el producto/servicio', message: error.message, timer: 2500});
      }
    });
  }


  // CAMBIO DE MARCA
  onChangeBrand(brandId: any) {
    if (brandId) {
      this._sharedSaleService.setBrandId(brandId);
    } else {
      this._sharedSaleService.setBrandId('');
    }
  }

  // CAMBIO DE TIPO SERVICIO
  onChangeTypeProduct(event: any) {
    this._sharedSaleService.setTypeProduct(event);
    if(event == 'S'){
      this.title = 'Servicio';
    } else if(event == 'P'){
      this.title = 'Producto';
    } else {
      this.title = 'Producto/servicio';
    }
  }


  
  /**
   * ****************************************************************
   * OPERACIONES EN LA TABLA
   * ****************************************************************
   */
  getDataRow(data: any){
    this.toggleForm(false);
  }

  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el producto/servicio?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiSaleDetailDelete(id);
      }
    });
  }


}
