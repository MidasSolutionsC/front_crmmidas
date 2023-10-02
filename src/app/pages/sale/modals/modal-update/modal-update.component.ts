import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss']
})
export class ModalUpdateComponent implements OnInit, OnDestroy {
  // REFERENCIA AL MODAL ACTUAL
  modalRefCurrent?: BsModalRef;

  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Formulario de venta'
  };
  
  private subscription: Subscription = new Subscription();
  
  constructor(){}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
