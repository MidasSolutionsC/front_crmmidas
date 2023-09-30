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
  public id: number;
  public clientes_id: number;
  public clientes_persona_juridica: string;
  public clientes_nombre: string;
  public clientes_tipo_documento: string;
  public clientes_documento: string;
  public comentario: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;


  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.clientes_id = this.clientes_id || null;
    this.clientes_persona_juridica = this.clientes_persona_juridica || null;
    this.clientes_nombre = this.clientes_nombre || null;
    this.clientes_tipo_documento = this.clientes_tipo_documento || null;
    this.clientes_documento = this.clientes_documento || null;
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
      clientes_id: obj.clientes_id,
      clientes_persona_juridica: obj.clientes_persona_juridica,
      clientes_nombre: obj.clientes_nombre,
      clientes_tipo_documento: obj.clientes_tipo_documento,
      clientes_documento: obj.clientes_documento,
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
