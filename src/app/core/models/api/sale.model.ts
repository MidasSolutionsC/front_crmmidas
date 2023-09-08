import { Model } from "./model";

export class Sale extends Model{
  public id: number;
  public dni: number;
  public cliente: string;
  public tipo: string;
  public instalaciones: string;
  public total: number;
  public usuario: string;
  public fecha: string;
  public estado: boolean;


  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.dni = this.dni || 0;
    this.cliente = this.cliente || '';
    this.tipo = this.tipo || '';
    this.instalaciones = this.instalaciones || '';
    this.total = this.total || 0;
    this.usuario = this.usuario || '';
    this.fecha = this.fecha || '';
    this.estado = this.estado || true;

  }

  public static cast(data: object): Sale{
    const sale = new Sale(data);
    const {id, dni, cliente, tipo, instalaciones, total, usuario, fecha, estado} = sale;
    return {id, dni, cliente, tipo, instalaciones, total, usuario, fecha, estado};
  }

  public static cats(dataArray: object[]): Sale[]{
    return dataArray.map((data) =>Sale.cast(data));
  }
}

export class SaleList extends Model{
  public id: number;
  public dni: number;
  public cliente: string;
  public tipo: string;
  public instalaciones: string;
  public total: number;
  public usuario: string;
  public fecha: string;
  public estado: boolean;


  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.dni = this.dni || 0;
    this.cliente = this.cliente || '';
    this.tipo = this.tipo || '';
    this.instalaciones = this.instalaciones || '';
    this.total = this.total || 0;
    this.usuario = this.usuario || '';
    this.fecha = this.fecha || '';
    this.estado = this.estado || true;
  }

  public static cast(data: object): SaleList{
    const saleList = new SaleList(data);
    const {id, dni, cliente, tipo, instalaciones, total, usuario, fecha, estado} = saleList;
    return {id, dni, cliente, tipo, instalaciones, total, usuario, fecha, estado};
  }
  public static cats(dataArray: object[]): SaleList[]{
    return dataArray.map((data) => SaleList.cast(data));
  }
}
