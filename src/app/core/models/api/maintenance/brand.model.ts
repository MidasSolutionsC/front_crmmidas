import { Model } from "../model";

export class Brand extends Model{
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

  public static cast(data: object): Brand{
    const brand = new Brand(data);
    const {id, nombre, descripcion, is_active} = brand;
    return {id, nombre, descripcion, is_active};
  }

  public static casts(dataArray: object[]): Brand[]{
    return dataArray.map((data) => Brand.cast(data));
  }
}

export class BrandList extends Model{
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

  public static cast(data: object): BrandList{
    const brandList = new BrandList(data);
    const { id, nombre, descripcion, is_active, created_at, updated_at, deleted_at } = brandList;
    return {id, nombre, descripcion, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): BrandList[]{
    return dataArray.map((data) => BrandList.cast(data));
  }
}