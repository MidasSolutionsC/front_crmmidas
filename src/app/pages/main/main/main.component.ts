import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  modalRef?: BsModalRef;


  // bread crumb items
  titleBreadCrumb: string = 'Inicio';
  breadCrumbItems: Array<{}>;


  constructor(){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard'}, { label: 'Inicio', active: true }];
    this.initForm();
    // this.listDataApi();
  }
  private initForm(){
    // const advertisement =  new Advertisement();
    // const formGroupData = this.getFormGroupData(advertisement);
    // this.advertisementForm = this.formBuilder.group(formGroupData);
  }
}
