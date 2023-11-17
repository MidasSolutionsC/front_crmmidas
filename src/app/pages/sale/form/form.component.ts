import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Breadcrumb, ResponseApi, Sale } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SaleService, ServiceService, SharedClientService, SharedSaleService, SweetAlertService, TempSaleService } from 'src/app/core/services';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  // bread crumb items
  titleBreadCrumb: string = 'Ventas';
  breadCrumbItems: Array<{}>;

  // DATOS VENTA A MODIFICAR
  dataSale: Sale = null;

  //IDs
  saleId: number = null;
  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _sharedSaleService: SharedSaleService,
    private _tempSaleService: TempSaleService,
    private _saleService: SaleService,
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

    // CLIENTE ID
    this.subscription.add(
      this._sharedClientService.getClientId()
      .pipe(filter((value) => value != null))
      .subscribe((value: number) => {
        this.clientId = value;
      })
    );

    // VENTA DATOS
    this.subscription.add(
      this._sharedSaleService.getDataSale()
      .pipe(filter((data) => data != null))
      .subscribe((data: Sale) => {
        this.dataSale = data;
      })
    );
    

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  
  /**
   * ****************************************************************
   * OPERACIONES CON LA API - FINALIZAR VENTA
   * ****************************************************************
   */
  public apiSaleFinalProcess(data: any, id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleService.finalProcess(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const [res] = response.data;
        this._sharedClientService.setClearData(true);
        this._sharedSaleService.setClearData(true);
        this.router.navigate(['/sale']);
      }

      if(response.code == 500 || response.code == 400){
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

  public apiSaleCancelProcess(data: any, id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleService.cancelProcess(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const [res] = response.data;
        this._sharedClientService.setClearData(true);
        this._sharedSaleService.setClearData(true);
        this.router.navigate(['/sale']);
      }

      if(response.code == 500 || response.code == 400){
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
   * ****************************************************************
   * OPERACIONES CON LA API - FINALIZAR VENTA TEMPORAL
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
        const requestSale = {...this.dataSale};

        if(this.clientId){
          requestSale.clientes_id = this.clientId;
        }

        this.apiSaleFinalProcess(requestSale, this.saleId);
      }
    })
  }

  cancelSaleFinal(){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de cancelar la venta?').then((confirm) => {
      if(confirm.isConfirmed){
        const requestSale = {...this.dataSale};

        if(this.clientId){
          requestSale.clientes_id = this.clientId;
        }

        this.apiSaleCancelProcess(requestSale, this.saleId);
      }
    })
  }


  
}
