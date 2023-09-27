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
  public comentario: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;


  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.clientes_id = this.clientes_id || null;
    this.comentario = this.comentario || '';
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): SaleList{
    const saleList = new SaleList(data);
    const {id, clientes_id, comentario, is_active, created_at, updated_at, deleted_at}= saleList;
    return {id, clientes_id, comentario, is_active, created_at, updated_at, deleted_at};
  }
  public static casts(dataArray: object[]): SaleList[]{
    return dataArray.map((data) => SaleList.cast(data));
  }
}
