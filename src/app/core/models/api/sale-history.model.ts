import { Model } from "./model";

export class SaleHistory extends Model{
  public id: number;
  public ventas_id: number;
  public ventas_detalles_id: number;
  public tipo: string;
  public tipo_estados_id: number;
  public comentario: string;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.ventas_detalles_id = this.ventas_detalles_id || null;
    this.tipo_estados_id = this.tipo_estados_id || null;
    this.tipo = this.tipo || null;
    this.comentario = this.comentario || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): SaleHistory{
    const obj = new SaleHistory(data);
    return {
      id: obj.id,
      ventas_id: obj.ventas_id,
      ventas_detalles_id: obj.ventas_detalles_id,
      tipo: obj.tipo, 
      tipo_estados_id: obj.tipo_estados_id,
      comentario: obj.comentario,
      is_active: obj.is_active
    }
  }

  public static casts(dataArray: object[]): SaleHistory[]{
    return dataArray.map((data) => SaleHistory.cast(data));
  }
}

export class SaleHistoryList extends Model{
  public id: number;
  public ventas_id: number;
  public ventas_detalles_id: number;
  public tipo: string;
  public tipo_estados_id: number;
  public tipo_estados_nombre: string;
  public servicios_nombre: string;
  public comentario: string;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.ventas_detalles_id = this.ventas_detalles_id || null;
    this.tipo_estados_id = this.tipo_estados_id || null;
    this.tipo_estados_nombre = this.tipo_estados_nombre || null;
    this.servicios_nombre = this.servicios_nombre || null;
    this.tipo = this.tipo || null;
    this.comentario = this.comentario || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): SaleHistoryList{
    const obj = new SaleHistoryList(data);
    return {
      id: obj.id,
      ventas_id: obj.ventas_id,
      ventas_detalles_id: obj.ventas_detalles_id,
      tipo: obj.tipo, 
      tipo_estados_id: obj.tipo_estados_id,
      tipo_estados_nombre: obj.tipo_estados_nombre,
      servicios_nombre: obj.servicios_nombre,
      comentario: obj.comentario,
      is_active: obj.is_active
    }
  }

  public static casts(dataArray: object[]): SaleHistoryList[]{
    return dataArray.map((data) => SaleHistoryList.cast(data));
  }
}

