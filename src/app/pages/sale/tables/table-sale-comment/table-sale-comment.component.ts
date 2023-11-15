import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription, distinctUntilChanged, filter } from 'rxjs';
import { ResponseApi, SaleComment, SaleCommentList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SharedSaleService, SweetAlertService, TempSaleCommentService } from 'src/app/core/services';

@Component({
  selector: 'app-table-sale-comment',
  templateUrl: './table-sale-comment.component.html',
  styleUrls: ['./table-sale-comment.component.scss']
})
export class TableSaleCommentComponent implements OnInit, OnDestroy {
  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos emitidos al formulario
  dataForm: SaleComment;

  // ID VENTA
  saleId: number = null;


  // Lista de documentos
  listSaleComments: SaleCommentList[] = [];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedSaleService: SharedSaleService,
    private _tmpSaleCommentService: TempSaleCommentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    
    // VENTA ID
    this.subscription.add(
      this._sharedSaleService.getSaleId()
      .pipe(filter((value) => value != null))
      .subscribe((value: number) => {
        this.saleId = value;
        this.apiTmpSaleCommentFilterBySale(value);
        })
    )

    // Subscriptionciones
    this.subscription.add(
      this._tmpSaleCommentService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: SaleCommentList[]) => {
        this.listSaleComments = list;
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
  public apiTmpSaleCommentFilterBySale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tmpSaleCommentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._tmpSaleCommentService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar comentarios', message: error.message, timer: 2500});
      }
    });
  }

  public apiTmpSaleCommentDelete(id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tmpSaleCommentService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleCommentList = SaleCommentList.cast(response.data[0]);
        this._tmpSaleCommentService.removeObjectObserver(data.id);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar el comentario', message: error.message, timer: 2500});
      }
    });
  }



  /**
   * ****************************************************************
   * OPERACIONES DE SALIDA DEL - FORM DOCUMENT
   * ****************************************************************
   */
  onSubmit(event: any){
    const {process, data} = event;
    if(process == 'saved'){
      const indexRow = this.listSaleComments.findIndex((item) => item.id == data.id);
      if(indexRow == -1){
        this.listSaleComments.push(data);
      }
    }

    if(process == 'updated'){
      const indexRow = this.listSaleComments.findIndex((item) => item.id == data.id);
      if(indexRow !== -1){
        this.listSaleComments[indexRow] = data;
      }
    }
    
    
    
    // if(this.saleId){
    //   this.apiTmpSaleCommentFilterBySale(this.saleId);
    // }
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
    this.dataForm = SaleComment.cast(data);
    this.toggleForm(false);
  }

  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el comentario?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiTmpSaleCommentFilterBySale(id);
      }
    });
  }
}
