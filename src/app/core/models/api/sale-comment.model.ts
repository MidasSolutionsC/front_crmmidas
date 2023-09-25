import { Model } from "./model";

export class SaleComment extends Model{
  public id: number;
  public ventas_id: number;
  public ventas_detalles_id: number;
  public comentario: string;
  public is_active: boolean | number;

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
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.ventas_detalles_id = this.ventas_detalles_id || null;
    this.comentario = this.comentario || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): SaleCommentList{
    const obj = new SaleCommentList(data);
    return {
      id: obj.id,
      ventas_id: obj.ventas_id,
      ventas_detalles_id: obj.ventas_detalles_id,
      comentario: obj.comentario,
      is_active: obj.is_active
    }
  }

  public static casts(dataArray: object[]): SaleCommentList[]{
    return dataArray.map((data) => SaleCommentList.cast(data));
  }
}

