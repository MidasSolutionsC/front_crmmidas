import { CdkStepper } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
 

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent {
  @ViewChild('cdkStepper') stepper: CdkStepper;


  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Modal Venta'
  };

  private subscription: Subscription = new Subscription();

  constructor(
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
  ) { }


}
