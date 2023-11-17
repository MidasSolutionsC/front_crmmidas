import { Model } from "./model";

export class Sale extends Model{
  public id: number;
  public clientes_id: number;
  public comentario: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.clientes_id = this.clientes_id || null;
    this.comentario = this.comentario || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Sale{
    const sale = new Sale(data);
    const {id, clientes_id, comentario, is_active} = sale;
    return {id, clientes_id, comentario, is_active};
  }

  public static casts(dataArray: object[]): Sale[]{
    return dataArray.map((data) =>Sale.cast(data));
  }
}

export class SaleList extends Model{
  public id?: number;
  public nro_orden?: number;
  public retailx_id?: string;
  public smart_id?: string;
  public direccion_smart_id?: string;
  public clientes_id?: number;
  public fecha?: string;
  public hora?: string;
  public comentario?: string;
  public is_active?: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.nro_orden = this.nro_orden || null;
    this.retailx_id = this.retailx_id || null;
    this.smart_id = this.smart_id || null;
    this.direccion_smart_id = this.direccion_smart_id || null;
    this.clientes_id = this.clientes_id || null;
    this.fecha = this.fecha || null;
    this.hora = this.hora || null;
    this.comentario = this.comentario || '';
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): SaleList{
    const obj = new SaleList(data);
    return {
      id: obj.id,
      nro_orden: obj.nro_orden,
      retailx_id: obj.retailx_id,
      smart_id: obj.smart_id,
      direccion_smart_id: obj.direccion_smart_id,
      clientes_id: obj.clientes_id,
      fecha: obj.fecha,
      hora: obj.hora,
      comentario: obj.comentario,
      is_active: obj.is_active,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
      deleted_at: obj.deleted_at,
    }
  }
  public static casts(dataArray: object[]): SaleList[]{
    return dataArray.map((data) => SaleList.cast(data));
  }
}
