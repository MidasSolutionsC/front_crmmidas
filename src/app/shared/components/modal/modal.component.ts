import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit {
  // modalRef: BsModalRef | undefined;

  @Input() show: boolean = false;
  @Input() title: string = '';
  @Output() accept = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  showContent: boolean = false; 

  constructor(public modalRef: BsModalRef) {
  }

  ngAfterViewInit() {
    this.showContent = true;
  }


  closeModal() {
    this.close.emit();
    this.modalRef.hide();
  }

  confirmed() {
    this.accept.emit();
    this.modalRef.hide();
  }
}
