import { Model } from "../model";
import { BrandList } from "./brand.model";
import { TypeServiceList } from "./type-service.model";

export class Product extends Model{
  public id?: number;
  public tipo_producto?: 'F' | 'S';
  public tipo_servicios_id?: number;
  public categorias_id?: number;
  public tipo_monedas_id?: number;
  public marcas_id?: number;
  public nombre?: string;
  public especificaciones?: string;
  public descripcion?: string;
  public precio?: number;
  public is_active?: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.tipo_producto = this.tipo_producto || null;
    this.tipo_servicios_id = this.tipo_servicios_id || null;
    this.categorias_id = this.categorias_id || null; 
    this.marcas_id = this.marcas_id || null;
    this.tipo_monedas_id = this.tipo_monedas_id || null;
    this.nombre = this.nombre || '';
    this.especificaciones = this.especificaciones || '';
    this.descripcion = this.descripcion || '';
    this.precio = this.precio || 0;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Product{
    const product = new Product(data);

    return {
      id: product.id,
      tipo_producto: product.tipo_producto,
      categorias_id: product.categorias_id,
      marcas_id: product.marcas_id,
      tipo_monedas_id: product.tipo_monedas_id,
      tipo_servicios_id: product.tipo_servicios_id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      especificaciones: product.especificaciones,
      precio: product.precio,
      is_active: product.is_active,
    }
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
  public tipo_monedas_id: number;
  public tipo_monedas_nombre: string;
  public tipo_monedas_simbolo: string;
  public tipo_monedas_iso_code: string;
  public tipo_servicios_id: number;
  public tipo_servicios_nombre: string;
  public nombre: string;
  public descripcion: string;
  public precio: number;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;
  public latest_price: any;
  public brand?: BrandList;
  public type_service?: TypeServiceList;

  constructor(data?: object){
    super(data);
    this.index = this.index || 0;
    this.id = this.id || 0;
    this.categorias_id = this.categorias_id || null;
    this.categorias_nombre = this.categorias_nombre || '';
    this.marcas_id = this.marcas_id || null;
    this.marcas_nombre = this.marcas_nombre || '';
    this.tipo_monedas_id = this.tipo_monedas_id || undefined;
    this.tipo_monedas_nombre = this.tipo_monedas_nombre || '';
    this.tipo_monedas_simbolo = this.tipo_monedas_simbolo || '';
    this.tipo_monedas_iso_code = this.tipo_monedas_iso_code || '';
    this.tipo_servicios_id = this.tipo_servicios_id || 0;
    this.tipo_servicios_nombre = this.tipo_servicios_nombre || '';
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.precio = this.precio || 0;
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
    this.latest_price = this.latest_price || null;
    this.brand = this.brand || null;
    this.type_service = this.type_service || null;
  }

  public static cast(data: object): ProductList{
    const obj = new ProductList(data);
    return {
      index: obj.index, 
      id: obj.id, 
      categorias_id: obj.categorias_id, 
      categorias_nombre: obj.categorias_nombre,
      marcas_id: obj.marcas_id, 
      marcas_nombre: obj.marcas_nombre, 
      tipo_monedas_id: obj.tipo_monedas_id, 
      tipo_monedas_nombre: obj.tipo_monedas_nombre, 
      tipo_monedas_simbolo: obj.tipo_monedas_simbolo, 
      tipo_monedas_iso_code: obj.tipo_monedas_iso_code, 
      tipo_servicios_id: obj.tipo_servicios_id, 
      tipo_servicios_nombre: obj.tipo_servicios_nombre, 
      nombre: obj.nombre, 
      descripcion: obj.descripcion, 
      precio: obj.precio, 
      is_active: obj.is_active, 
      created_at: obj.created_at, 
      updated_at: obj.updated_at, 
      deleted_at: obj.deleted_at,
      latest_price: obj.latest_price,
      brand: obj.brand,
      type_service: obj.type_service,

    };
  }

  public static casts(dataArray: object[]): ProductList[]{
    return dataArray.map((data) => ProductList.cast(data));
  }
}