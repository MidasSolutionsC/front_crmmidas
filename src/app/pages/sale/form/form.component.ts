import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Breadcrumb } from 'src/app/core/models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  // bread crumb items
  titleBreadCrumb: string = 'Ventas';
  breadCrumbItems: Array<{}>;

  
  private subscription: Subscription = new Subscription();

  constructor(){}

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Venta formulario', active: true }]);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
