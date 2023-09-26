import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { ResponseApi, SaleHistory, SaleHistoryList } from 'src/app/core/models';
import { SweetAlertService, TmpSaleHistoryService } from 'src/app/core/services';

@Component({
  selector: 'app-table-sale-history',
  templateUrl: './table-sale-history.component.html',
  styleUrls: ['./table-sale-history.component.scss']
})
export class TableSaleHistoryComponent implements OnInit, OnDestroy {

  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos emitidos al formulario
  dataForm: SaleHistory;

  // Lista de documentos
  listSaleHistory: SaleHistoryList[] = [];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private _tmpSaleHistoryService: TmpSaleHistoryService,
    private _sweetAlertService: SweetAlertService,
  ){}

  ngOnInit(): void {
    const ventaId = localStorage.getItem('ventas_id');
    if(ventaId !== null && ventaId !== undefined){
      this.apiSaleHistoryFilterBySale(parseInt(ventaId));
    }
    
    // Subscriptionciones
    this.subscription.add(
      this._tmpSaleHistoryService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: SaleHistoryList[]) => {
        this.listSaleHistory = list;
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
    }
  }


  /**
   * ****************************************************************
   * ABRIR TABLA 
   * ****************************************************************
   */
  toggleList(collapse: boolean = null){
    this.isCollapseList = collapse || !this.isCollapseList;
    if(!this.isCollapseList){
      this.isCollapseForm = true;
    }
  }


  
   /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
   public apiSaleHistoryFilterBySale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tmpSaleHistoryService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._tmpSaleHistoryService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar historial', message: error.message, timer: 2500});
      }
    });
  }

  public apiSaleHistoryDelete(id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tmpSaleHistoryService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleHistoryList = SaleHistoryList.cast(response.data[0]);
        this._tmpSaleHistoryService.removeObjectObserver(data.id);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar el historial', message: error.message, timer: 2500});
      }
    });
  }



  /**
   * ****************************************************************
   * OPERACIONES DE SALIDA DEL - FORM DOCUMENT
   * ****************************************************************
   */
  onSubmit(event: any){
    if(event?.saved){
      this.toggleList(false);
      
      const ventaId = localStorage.getItem('ventas_id');
      if(ventaId !== null && ventaId !== undefined){
        this.apiSaleHistoryFilterBySale(parseInt(ventaId));
      } else {
        this.apiSaleHistoryFilterBySale(event?.data?.ventas_id);
      }
    }
  }

  onCancel(event: any){
    // console.log(data);
  }


  /**
   * ****************************************************************
   * OPERACIONES EN LA TABLA
   * ****************************************************************
   */
  getDataRow(data: any){
    this.dataForm = SaleHistory.cast(data);
    this.toggleForm(false);
  }

  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el historial?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiSaleHistoryFilterBySale(id);
      }
    });
  }
}
