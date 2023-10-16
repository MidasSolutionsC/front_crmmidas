import { Component } from '@angular/core';
import { SaleDetailList } from 'src/app/core/models';

@Component({
  selector: 'app-table-sale-detail-full',
  templateUrl: './table-sale-detail-full.component.html',
  styleUrls: ['./table-sale-detail-full.component.scss']
})
export class TableSaleDetailFullComponent {
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

  // LISTA DE SERVICIOS AÑADIDOS A LA VENTA
  listSaleDetail: SaleDetailList[] = [];

  constructor(){}


    
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

}
