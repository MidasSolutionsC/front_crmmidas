import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Installation, SaleDetailList } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class SharedSaleService {
  private saleId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private brandId: BehaviorSubject<number | string> = new BehaviorSubject<number | string>(null);
  private installationId: BehaviorSubject<number | string> = new BehaviorSubject<number | string>(null);
  private dataInstallation: BehaviorSubject<Installation> = new BehaviorSubject<Installation>(null);
  private saleDetail: BehaviorSubject<SaleDetailList> = new BehaviorSubject<SaleDetailList>(null);

  constructor() { }

  // VENTA
  getSaleId() {
    return this.saleId.asObservable();
  }

  setSaleId(value: number) {
    this.saleId.next(value);
  }

  // MARCA
  getBrandId() {
    return this.brandId.asObservable();
  }

  setBrandId(value: number | string) {
    this.brandId.next(value);
  }

  // INSTALACIÓN
  getInstallationId() {
    return this.installationId.asObservable();
  }

  setInstallationId(value: number | string) {
    this.installationId.next(value);
  }

  // DATA INSTALACIÓN
  getDataInstallation() {
    return this.dataInstallation.asObservable();
  }

  setDataInstallation(value: Installation) {
    this.dataInstallation.next(value);
  }

  // DETALLE
  getSaleDetail() {
    return this.saleDetail.asObservable();
  }

  setSaleDetail(value: SaleDetailList) {
    this.saleDetail.next(value);
  }
}
