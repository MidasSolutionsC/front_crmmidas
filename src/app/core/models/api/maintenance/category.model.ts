import { Model } from "../model";

export class Category extends Model{
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

  public static cast(data: object): Category{
    const category = new Category(data);
    const {id, nombre, descripcion, is_active} = category;
    return {id, nombre, descripcion, is_active};
  }

  public static casts(dataArray: object[]): Category[]{
    return dataArray.map((data) => Category.cast(data));
  }
}

export class CategoryList extends Model{
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

  public static cast(data: object): CategoryList{
    const categoryList = new CategoryList(data);
    const { id, nombre, descripcion, is_active, created_at, updated_at, deleted_at } = categoryList;
    return {id, nombre, descripcion, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): CategoryList[]{
    return dataArray.map((data) => CategoryList.cast(data));
  }
}