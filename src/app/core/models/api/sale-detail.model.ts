import { Model } from "./model";

export class SaleDetail extends Model{
  public id: number;
  public ventas_id: number;
  public servicios_id: number;
  public instalaciones_id: number;
  public observacion: string;
  public fecha_cierre: string;
  public datos_json: object;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.ventas_id = this.ventas_id || 0;
    this.servicios_id = this.servicios_id || 0;
    this.instalaciones_id = this.instalaciones_id || 0;
    this.observacion = this.observacion || '';
    this.fecha_cierre = this.fecha_cierre || '';
    this.datos_json = this.datos_json || {};
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): SaleDetail{
    const saleDetail = new SaleDetail(data);
    const {
      id, 
      ventas_id,
      servicios_id,
      instalaciones_id,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    } = saleDetail;

    return {
      id, 
      ventas_id,
      servicios_id,
      instalaciones_id,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    }
  }

  public static casts(dataArray: object[]): SaleDetail[]{
    return dataArray.map((data) =>SaleDetail.cast(data));
  }
}

export class SaleDetailList extends Model{
  public id: number;
  public ventas_id: number;
  public servicios_id: number;
  public instalaciones_id: number;
  public observacion: string;
  public fecha_cierre: string;
  public datos_json: object;
  public is_active: boolean;


  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.ventas_id = this.ventas_id || 0;
    this.servicios_id = this.servicios_id || 0;
    this.instalaciones_id = this.instalaciones_id || 0;
    this.observacion = this.observacion || '';
    this.fecha_cierre = this.fecha_cierre || '';
    this.datos_json = this.datos_json || {};
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): SaleDetailList{
    const saleDetailList = new SaleDetailList(data);
    const {
      id, 
      ventas_id,
      servicios_id,
      instalaciones_id,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    }= saleDetailList;
    
    return {
      id, 
      ventas_id,
      servicios_id,
      instalaciones_id,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    };
  }
  public static casts(dataArray: object[]): SaleDetailList[]{
    return dataArray.map((data) => SaleDetailList.cast(data));
  }
}
