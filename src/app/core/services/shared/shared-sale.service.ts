import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SaleDetailList } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class SharedSaleService {
  private saleId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private saleDetail: BehaviorSubject<SaleDetailList> = new BehaviorSubject<SaleDetailList>(null);

  constructor() { }

  // VENTA
  getSaleId() {
    return this.saleId.asObservable();
  }

  setSaleId(value: number) {
    this.saleId.next(value);
  }

  // DETALLE
  getSaleDetail() {
    return this.saleDetail.asObservable();
  }

  setSaleDetail(value: SaleDetailList) {
    this.saleDetail.next(value);
  }
}
