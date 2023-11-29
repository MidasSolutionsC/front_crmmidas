import { Model } from "./model";

export class SaleComment extends Model{
  public id?: number;
  public ventas_id?: number;
  public ventas_detalles_id?: number;
  public comentario?: string;
  public is_active?: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.ventas_detalles_id = this.ventas_detalles_id || null;
    this.comentario = this.comentario || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): SaleComment{
    const obj = new SaleComment(data);
    return {
      id: obj.id,
      ventas_id: obj.ventas_id,
      ventas_detalles_id: obj.ventas_detalles_id,
      comentario: obj.comentario,
      is_active: obj.is_active
    }
  }

  public static casts(dataArray: object[]): SaleComment[]{
    return dataArray.map((data) => SaleComment.cast(data));
  }
}


export class SaleCommentList extends Model{
  public id: number;
  public ventas_id: number;
  public ventas_detalles_id: number;
  public comentario: string;
  public fecha: string;
  public hora: string;
  public user_created_id: string;
  public user_updated_id: string;
  public user_deleted_id: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.ventas_detalles_id = this.ventas_detalles_id || null;
    this.comentario = this.comentario || null;
    this.fecha = this.fecha || null;
    this.hora = this.hora || null;
    this.user_created_id = this.user_created_id || null;
    this.user_updated_id = this.user_updated_id || null;
    this.user_deleted_id = this.user_deleted_id || null;
    this.created_at = this.created_at || null;
    this.updated_at = this.updated_at || null;
    this.deleted_at = this.deleted_at || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): SaleCommentList{
    const obj = new SaleCommentList(data);
    return {
      id: obj.id,
      ventas_id: obj.ventas_id,
      ventas_detalles_id: obj.ventas_detalles_id,
      comentario: obj.comentario,
      fecha: obj.fecha,
      hora: obj.hora,
      user_created_id: obj.user_created_id,
      user_updated_id: obj.user_updated_id,
      user_deleted_id: obj.user_deleted_id,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
      deleted_at: obj.deleted_at,
      is_active: obj.is_active
    }
  }

  public static casts(dataArray: object[]): SaleCommentList[]{
    return dataArray.map((data) => SaleCommentList.cast(data));
  }
}

