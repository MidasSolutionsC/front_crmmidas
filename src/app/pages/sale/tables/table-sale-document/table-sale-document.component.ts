import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription, distinctUntilChanged, filter } from 'rxjs';
import { ResponseApi, SaleDocument, SaleDocumentList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SaleDocumentService, SharedSaleService, SweetAlertService, TempSaleDocumentService } from 'src/app/core/services';

@Component({
  selector: 'app-table-sale-document',
  templateUrl: './table-sale-document.component.html',
  styleUrls: ['./table-sale-document.component.scss']
})
export class TableSaleDocumentComponent implements OnInit, OnDestroy {

  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos emitidos al formulario
  dataFormDocument: SaleDocument;

  // Lista de documentos
  listSaleDocuments: SaleDocumentList[] = [];

  saleId: number;
  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _shareSaleService: SharedSaleService,
    private _saleDocumentService: SaleDocumentService,
    private _tmpSaleDocumentService: TempSaleDocumentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    
    // ID VENTA
    this.subscription.add(
      this._shareSaleService.getSaleId().pipe(filter(value => value !== null)).subscribe((value: number) =>  {
        this.saleId = value
        this.apiSaleDocumentFilterBySale(value);
      })
    )

    // Subscriptionciones
    this.subscription.add(
      this._saleDocumentService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: SaleDocumentList[]) => {
        this.listSaleDocuments = list;
      })
    );    


    // LIMPIAR DATOS
    this.subscription.add(
      this._shareSaleService.getClearData().subscribe((value: boolean) => {
        if(value){
          this.onReset()
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
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
   * OPERACIONES CON LA API  - DOCUMENTOS VENTA TEMPORALES
   * ****************************************************************
   */
  public apiSaleDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar archivos', message: error.message, timer: 2500});
      }
    });
  }

  public apiSaleDocumentFilterBySale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDocumentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.lists = response.data;
        this._saleDocumentService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar archivos', message: error.message, timer: 2500});
      }
    });
  }

  public apiSaleDocumentDelete(id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDocumentService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleDocumentList = SaleDocumentList.cast(response.data[0]);
        this._saleDocumentService.removeObjectObserver(data.id);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar el archivo', message: error.message, timer: 2500});
      }
    });
  }

  
  /**
   * ****************************************************************
   * OPERACIONES CON LA API  - DOCUMENTOS VENTA TEMPORALES
   * ****************************************************************
   */
  public apiTempSaleDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tmpSaleDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar archivos', message: error.message, timer: 2500});
      }
    });
  }

  public apiTempSaleDocumentFilterBySale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tmpSaleDocumentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.lists = response.data;
        this._tmpSaleDocumentService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar archivos', message: error.message, timer: 2500});
      }
    });
  }

  public apiTempSaleDocumentDelete(id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tmpSaleDocumentService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleDocumentList = SaleDocumentList.cast(response.data[0]);
        this._tmpSaleDocumentService.removeObjectObserver(data.id);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar el archivo', message: error.message, timer: 2500});
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

      const ventaId = this.saleId;
      if(ventaId){
        this.apiSaleDocumentFilterBySale(ventaId);
      } else {
        this.apiSaleDocumentFilterBySale(event?.data?.ventas_id);
      }
    }
  }

  onCancel(event: any){
    // console.log(data);
  }

  onReset(){
    this.saleId = null;
    this.clientId = null;
    this.personId = null;
    this.companyId = null;
    this.legalPerson = null;
    this.listSaleDocuments = [];
  }


  /**
   * ****************************************************************
   * OPERACIONES EN LA TABLA
   * ****************************************************************
   */
  getDataRow(data: any){
    this.dataFormDocument = SaleDocument.cast(data);
    this.toggleForm(false);
  }

  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el archivo?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiSaleDocumentDelete(id);
      }
    });
  }

}
