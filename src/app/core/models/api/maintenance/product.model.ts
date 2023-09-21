import { Model } from "../model";

export class Product extends Model{
  public id: number;
  public tipo_servicios_id: number;
  public categorias_id: number;
  public divisas_id: number;
  public marcas_id: number;
  public nombre: string;
  public descripcion: string;
  public precio: number;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.tipo_servicios_id = this.tipo_servicios_id || null;
    this.categorias_id = this.categorias_id || null; 
    this.marcas_id = this.marcas_id || null;
    this.divisas_id = this.divisas_id || null;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.precio = this.precio || 0;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Product{
    const product = new Product(data);
    const {id, categorias_id, marcas_id, divisas_id, tipo_servicios_id, nombre, descripcion, precio, is_active} = product;
    return {id, categorias_id, marcas_id, divisas_id, tipo_servicios_id, nombre, descripcion, precio, is_active};
  }

  public static casts(dataArray: object[]): Product[]{
    return dataArray.map((data) => Product.cast(data));
  }
}

export class ProductList extends Model{
  public index: number;
  public id: number;
  public categorias_id: number;
  public categorias_nombre: string;
  public marcas_id: number;
  public marcas_nombre: string;
  public divisas_id: number;
  public divisas_nombre: string;
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
    this.index = this.index || 0;
    this.id = this.id || 0;
    this.categorias_id = this.categorias_id || null;
    this.categorias_nombre = this.categorias_nombre || '';
    this.marcas_id = this.marcas_id || null;
    this.marcas_nombre = this.marcas_nombre || '';
    this.divisas_id = this.divisas_id || undefined;
    this.divisas_nombre = this.divisas_nombre || '';
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
    const {
      index, 
      id, 
      categorias_id, 
      categorias_nombre,
       marcas_id, 
       marcas_nombre, 
       divisas_id, 
       divisas_nombre, 
       tipo_servicios_id, 
       tipo_servicios_nombre, 
       nombre, 
       descripcion, 
       precio, 
       is_active, 
       created_at, 
       updated_at, 
       deleted_at
      } = productList;
    return {index, id, categorias_id, categorias_nombre, marcas_id, marcas_nombre, divisas_id, divisas_nombre, tipo_servicios_id, tipo_servicios_nombre, nombre, descripcion, precio, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): ProductList[]{
    return dataArray.map((data) => ProductList.cast(data));
  }
}