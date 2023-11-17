import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { SaleList } from 'src/app/core/models';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss']
})
export class ModalUpdateComponent implements OnInit, OnDestroy, OnChanges {
  // DATOS DE ENTRADAS
  @Input() dataInput: SaleList = null; 

  // REFERENCIA AL MODAL ACTUAL
  modalRefCurrent?: BsModalRef;

  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Formulario de venta'
  };
  
  private subscription: Subscription = new Subscription();
  
  constructor(
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data && !changes.data.firstChange){
      this.onChanges();
    }
  }


  /***
   * ***************************************************************
   * DETECTAR CAMBIOS EN LA VARIABLE DE ENTRADA
   * ***************************************************************
   */
  onChanges(){
    if(this.dataInput){
      console.log("DATOS DE LA VENTA:",this.dataInput);
    }
  }



  /***
   * ***************************************************************
   * OPERACIONES DE OTROS COMPONENTES
   * ***************************************************************
   */

}
