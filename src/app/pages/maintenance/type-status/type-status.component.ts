import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-type-status',
  templateUrl: './type-status.component.html',
  styleUrls: ['./type-status.component.scss']
})
export class TypeStatusComponent {
  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  openModal() {
    this.bsModalRef = this.modalService.show(ModalComponent, {
      class: 'modal-md',
      initialState: {
        title: 'Título del Modal', // Personaliza el título según tus necesidades
        show: true
      }
    });

    this.bsModalRef.content.accept.subscribe(() => {
      // Lógica a realizar al aceptar el modal
      console.log('Aceptar modal');
    });

    this.bsModalRef.content.close.subscribe(() => {
      // Lógica a realizar al cerrar el modal
      console.log('Cerrar modal');
    });
  }
}
