import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Installation, InstallationList, Sale, SaleDetailList } from '../../models';

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
  private dataSale: BehaviorSubject<Sale> = new BehaviorSubject<Sale>(null);
  private saleDetail: BehaviorSubject<SaleDetailList> = new BehaviorSubject<SaleDetailList>(null);
  private clearData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {
    this.clearData.asObservable().subscribe((value: boolean) => {
      if(value){
        this.saleId.next(null);
        this.brandId.next(null);
        this.typeProduct.next(null);
        this.typeServiceId.next(null);
        this.installationId.next(null);
        this.dataInstallation.next(null);
        this.dataSale.next(null);
        this.saleDetail.next(null);
        // this.clearData.next(null);
      }
    })
   }

  // VENTA
  getSaleId() {
    return this.saleId.asObservable();
  }

  setSaleId(value: number) {
    this.saleId.next(value);
  }

  getDataSale() {
    return this.dataSale.asObservable();
  }

  setDataSale(data: Sale) {
    this.dataSale.next(data);
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
  getClearData() {
    return this.clearData.asObservable();
  }

  setClearData(value: boolean) {
    this.clearData.next(value);
  }
}
