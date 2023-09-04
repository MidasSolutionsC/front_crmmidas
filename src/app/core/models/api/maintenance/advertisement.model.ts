import { Model } from "../model";

export class Advertisement extends Model{
  public id: number;
  public titulo: string;
  public descripcion: string;
  public tipo: string;
  public imagen: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.titulo = this.titulo || '';
    this.descripcion = this.descripcion || '';
    this.tipo = this.tipo || '';
    this.imagen = this.imagen || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Advertisement{
    const advertisement = new Advertisement(data);
    const {id, titulo, descripcion, tipo, imagen, is_active} = advertisement;
    return {id, titulo, descripcion, tipo, imagen, is_active};
  }

  public static cats(dataArray: object[]): Advertisement[]{
    return dataArray.map((data) => Advertisement.cast(data));
  }
}

export class AdvertisementList extends Model{
  public id: number;
  public titulo: string;
  public descripcion: string;
  public tipo: string;
  public tipo_text: string;
  public imagen: string;
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
    this.titulo = this.titulo || '';
    this.descripcion = this.descripcion || '';
    this.tipo = this.tipo || '';
    this.tipo_text = this.tipo_text || '';
    this.imagen = this.imagen || '';
    this.is_active = this.is_active || false;
    this.user_create_id = this.user_create_id || 0;
    this.user_update_id = this.user_update_id || 0;
    this.user_delete_id = this.user_delete_id || 0;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): AdvertisementList{
    const advertisementList = new AdvertisementList(data);
    const { id, titulo, descripcion, tipo, tipo_text, imagen, is_active, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at } = advertisementList;
    return {id, titulo, descripcion, tipo, tipo_text, imagen, is_active, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at};
  }

  public static cats(dataArray: object[]): AdvertisementList[]{
    return dataArray.map((data) => AdvertisementList.cast(data));
  }
}