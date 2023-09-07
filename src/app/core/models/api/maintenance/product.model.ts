import { Model } from "../model";

export class Product extends Model{
  public id: number;
  public tipo_servicios_id: number;
  public nombre: string;
  public descripcion: string;
  public precio: number;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.tipo_servicios_id = this.tipo_servicios_id || 0;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.precio = this.precio || 0;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Product{
    const product = new Product(data);
    const {id, tipo_servicios_id, nombre, descripcion, precio, is_active} = product;
    return {id, tipo_servicios_id, nombre, descripcion, precio, is_active};
  }

  public static casts(dataArray: object[]): Product[]{
    return dataArray.map((data) => Product.cast(data));
  }
}

export class ProductList extends Model{
  public id: number;
  public tipo_servicios_id: number;
  public tipo_servicios_nombre: string;
  public nombre: string;
  public descripcion: string;
  public precio: number;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.tipo_servicios_id = this.tipo_servicios_id || 0;
    this.tipo_servicios_nombre = this.tipo_servicios_nombre || '';
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.precio = this.precio || 0;
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): ProductList{
    const productList = new ProductList(data);
    const {id, tipo_servicios_id, tipo_servicios_nombre, nombre, descripcion, precio, is_active, created_at, updated_at, deleted_at} = productList;
    return {id, tipo_servicios_id, tipo_servicios_nombre, nombre, descripcion, precio, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): ProductList[]{
    return dataArray.map((data) => ProductList.cast(data));
  }
}