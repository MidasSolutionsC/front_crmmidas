import { Model } from "../model";

export class TypeStatus extends Model{
  public id: number;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;
  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): TypeStatus{
    const typeStatus= new TypeStatus(data);
    const { id, nombre, descripcion, is_active } = typeStatus;
    return {id, nombre, descripcion, is_active};
  }

  public static cats(dataArray: object[]): TypeStatus[]{
    return dataArray.map((data) => TypeStatus.cast(data));
  }
}

export class TypeStatusList extends Model{
  public id: number;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): TypeStatusList{
    const typeStatusList = new TypeStatusList(data);
    const { id, nombre, descripcion, is_active, created_at, updated_at, deleted_at } = typeStatusList;
    return {id, nombre, descripcion, is_active, created_at, updated_at, deleted_at};
  }

  public static cats(dataArray: object[]): TypeStatusList[]{
    return dataArray.map((data) => TypeStatusList.cast(data));
  }
}