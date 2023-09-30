import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DetailFixedLine, DetailFixedLineList, DetailMobileLine, DetailMobileLineList, SaleDetail, SaleDetailList } from 'src/app/core/models';
import { SharedSaleService } from 'src/app/core/services';

@Component({
  selector: 'app-table-sale-detail',
  templateUrl: './table-sale-detail.component.html',
  styleUrls: ['./table-sale-detail.component.scss']
})
export class TableSaleDetailComponent implements OnInit, OnDestroy, OnChanges {
  // Datos de entrada
  @Input() index: number = null;
  @Input() typeService: string = null;
  @Input() data: SaleDetailList = null;


  saleDetail: SaleDetailList;

  // Lista de mobile
  detailMobile: DetailMobileLineList;
  listDetailMobile: DetailMobileLineList[] = [];

  // Lista de fixed
  detailFixed: DetailFixedLineList;
  listDetailFixed: DetailFixedLineList[] = [];

  // Datos de salida
  @Output() cancel = new EventEmitter<any>();

  constructor(){}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    
  }


  ngOnChanges(changes: SimpleChanges): void {
    if((changes.data && !changes.data.firstChange) || (changes.typeService && !changes.typeService.firstChange)){
      setTimeout(() => {
        this.initializeData();
      }, 0);
    }  
  }


  // IMICIALIZACIÓN DE DATOS
  initializeData(){
    if(this.data){
      this.saleDetail = this.data;
    } else {
      this.saleDetail = null;
    }

    if(this.typeService){
      const json = this.data?.datos_json && JSON.stringify(this.data?.datos_json) !== '{}'? this.data.datos_json: null;

      switch(this.typeService){
        case 'mobile':
          if(json != null){
            this.detailMobile = DetailMobileLineList.cast(json);
            this.listDetailMobile = [DetailMobileLineList.cast(json)];        
          }
          break;
          case 'fixed':
            if(json != null){
            this.detailFixed = DetailFixedLineList.cast(json);
            this.listDetailFixed = [DetailFixedLineList.cast(json)];     
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
   * ***********************************************
   * EMITIR VALOREES CANCELADO
   * ***********************************************
   */
   onCancel(){
    this.cancel.emit(this.index);
  }
}
