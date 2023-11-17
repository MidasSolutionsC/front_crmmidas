import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Installation, InstallationList, SaleDetailList } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class SharedSaleService {
  private saleId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private brandId: BehaviorSubject<number | string> = new BehaviorSubject<number | string>(null);
  private typeProduct: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private typeServiceId: BehaviorSubject<number | string> = new BehaviorSubject<number | string>(null);
  private installationId: BehaviorSubject<number | string> = new BehaviorSubject<number | string>(null);
  private dataInstallation: BehaviorSubject<InstallationList> = new BehaviorSubject<InstallationList>(null);
  private saleDetail: BehaviorSubject<SaleDetailList> = new BehaviorSubject<SaleDetailList>(null);
  private clearSale: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

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

  // TIPO SERVICIO
  getTypeServiceId() {
    return this.typeServiceId.asObservable();
  }

  setTypeServiceId(value: number | string) {
    this.typeServiceId.next(value);
  }

  // TIPO PRODUCTO
  getTypeProduct() {
    return this.typeProduct.asObservable();
  }

  setTypeProduct(value: string) {
    this.typeProduct.next(value);
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

  setDataInstallation(value: InstallationList) {
    this.dataInstallation.next(value);
  }

  // DETALLE
  getSaleDetail() {
    return this.saleDetail.asObservable();
  }

  setSaleDetail(value: SaleDetailList) {
    this.saleDetail.next(value);
  }

  // LIMPIAR DATOS Y VARIABLES DE LA VENTA
  getClear() {
    return this.clearSale.asObservable();
  }

  setClear(value: boolean) {
    this.clearSale.next(value);
  }
}
