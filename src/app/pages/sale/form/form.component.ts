import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { Breadcrumb, ResponseApi } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, ServiceService, SharedClientService, SharedSaleService, SweetAlertService, TempSaleService } from 'src/app/core/services';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  // bread crumb items
  titleBreadCrumb: string = 'Ventas';
  breadCrumbItems: Array<{}>;

  //IDs
  saleId: number = null;
  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _sharedSaleService: SharedSaleService,
    private _tempSaleService: TempSaleService,
    private _serviceService: ServiceService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Venta formulario', active: true }]);

    // VENTA ID
    this.subscription.add(
      this._sharedSaleService.getSaleId()
      .pipe(filter((value) => value != null))
      .subscribe((value: number) => {
        this.saleId = value;
      })
    );
    

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  
  /**
   * ****************************************************************
   * OPERACIONES CON LA API - INSTALACIONES
   * ****************************************************************
   */
  public apiTempSaleFinalProcess(data: any){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleService.finalProcess(data).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al finalizar la venta', message: error.message, timer: 2500});
      }
    });
  }


  
  /**
   * *************************************************************
   * TERMINAR VENTA
   * *************************************************************
   */
  saveSaleFinal(){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de terminar la venta?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiTempSaleFinalProcess({ventas_id: this.saleId});
      }
    })
  }


  
}
