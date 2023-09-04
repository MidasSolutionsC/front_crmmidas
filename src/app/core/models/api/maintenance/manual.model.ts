import { Model } from "../model";

export class Manual extends Model{
  public id: number;
  public nombre: string;
  public tipo: string;
  public archivo: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.nombre = this.nombre || '';
    this.tipo = this.tipo || '';
    this.archivo = this.archivo || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Manual{
    const manual = new Manual(data);
    const {id, nombre, tipo, archivo, is_active} = manual;
    return {id, nombre, tipo, archivo, is_active};
  }

  public static cats(dataArray: object[]): Manual[]{
    return dataArray.map((data) => Manual.cast(data));
  }
}

export class ManualList extends Model{
  public id: number;
  public nombre: string;
  public tipo: string;
  public tipo_text: string;
  public archivo: string;
  public is_active: boolean;
  public user_create_id: number;
  public user_update_id: number;
  public user_delete_id: number;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.tipo = this.tipo || '';
    this.tipo_text = this.tipo_text || '';
    this.archivo = this.archivo || '';
    this.is_active = this.is_active || false;
    this.user_create_id = this.user_create_id || 0;
    this.user_update_id = this.user_update_id || 0;
    this.user_delete_id = this.user_delete_id || 0;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): ManualList{
    const manualList = new ManualList(data);
    const { id, nombre, tipo, tipo_text, archivo, is_active, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at } = manualList;
    return {id, nombre, tipo, tipo_text, archivo, is_active, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at};
  }

  public static cats(dataArray: object[]): ManualList[]{
    return dataArray.map((data) => ManualList.cast(data));
  }
}