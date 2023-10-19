import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BrandList, ResponseApi, SaleDetailList } from 'src/app/core/models';
import { ApiErrorFormattingService, BrandService, SharedSaleService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-table-sale-detail-full',
  templateUrl: './table-sale-detail-full.component.html',
  styleUrls: ['./table-sale-detail-full.component.scss']
})
export class TableSaleDetailFullComponent implements OnInit, OnDestroy {
  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos de la venta
  dataBasicPreview: any = {
    fecha: '11-10-2023',
    smart_id: '',
    smart_address_id: '',
    address: ''
  };

  // ID MARCA
  brandId: any = '';
  
  // LISTA DE MARCAS (COMPAÑAS)
  listBrand: BrandList[] = [];

  // LISTA DE SERVICIOS AÑADIDOS A LA VENTA
  listSaleDetail: SaleDetailList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private _brandService: BrandService,
    private _sharedSaleService: SharedSaleService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    
    this.apiBrandList();

    // MARCAS
    this.subscription.add(
      this._brandService.listObserver$
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
   * ABRIR FORMULARIO 
   * ****************************************************************
   */
  toggleForm(collapse: boolean = null){
    this.isCollapseForm = collapse || !this.isCollapseForm;
    if(!this.isCollapseForm){
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
  
  // CAMBIO DE MARCA
  onChangeBrand(brandId: any){
    if(brandId){
      this._sharedSaleService.setBrandId(brandId);
    } else {
      this._sharedSaleService.setBrandId('');
    }
  }


}
