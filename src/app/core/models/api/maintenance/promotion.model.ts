import { Model } from "../model";

export class Promotion extends Model{
  public id?: number;
  public tipo_producto?: 'F' | 'S';
  public tipo_servicios_id?: number;
  public marcas_id?: number;
  public tipo_monedas_id?: number;
  public nombre?: string;
  public descripcion?: string;
  public tipo_descuento?: 'C' | 'P';
  public descuento?: number;
  public fecha_inicio?: string;
  public fecha_fin?: string;
  public codigo?: string;
  public cantidad_minima?: number;
  public cantidad_maxima?: number;
  public is_private?: boolean;
  public is_active?: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.tipo_producto = this.tipo_producto || null;
    this.tipo_servicios_id = this.tipo_servicios_id || null;
    this.marcas_id = this.marcas_id || null;
    this.tipo_monedas_id = this.tipo_monedas_id || null;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.tipo_descuento = this.tipo_descuento || 'P';
    this.descuento = this.descuento || 0;
    this.fecha_inicio = this.fecha_inicio || '',
    this.fecha_fin = this.fecha_fin || '',
    this.codigo = this.codigo || '',
    this.cantidad_minima = this.cantidad_minima || 0,
    this.cantidad_maxima = this.cantidad_maxima || null,
    this.is_private = this.is_private || false;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Promotion{
    const promotion = new Promotion(data);
    return {
      id: promotion.id,
      tipo_producto: promotion.tipo_producto,
      marcas_id: promotion.marcas_id,
      tipo_monedas_id: promotion.tipo_monedas_id,
      tipo_servicios_id: promotion.tipo_servicios_id,
      nombre: promotion.nombre,
      descripcion: promotion.descripcion,
      tipo_descuento: promotion.tipo_descuento,
      descuento: promotion.descuento,
      fecha_inicio: promotion.fecha_inicio,
      fecha_fin: promotion.fecha_fin,
      codigo: promotion.codigo,
      cantidad_minima: promotion.cantidad_minima,
      cantidad_maxima: promotion.cantidad_maxima,
      is_private: promotion.is_private,
      is_active: promotion.is_active,
    }
  }

  public static casts(dataArray: object[]): Promotion[]{
    return dataArray.map((data) => Promotion.cast(data));
  }
}

export class PromotionList extends Model{
  public id: number;
  public tipo_servicios_id: number;
  public tipo_servicios_nombre: string;
  public nombre: string;
  public descripcion: string;
  public tipo_descuento: 'C' | 'D';
  public descuento: number;
  public fecha_inicio: string;
  public fecha_fin: string;
  public codigo: string;
  public cantidad_minima: number;
  public cantidad_maxima: number;
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
    this.tipo_descuento = this.tipo_descuento || 'C';
    this.descuento = this.descuento || 0;
    this.fecha_inicio = this.fecha_inicio || '',
    this.fecha_fin = this.fecha_fin || '',
    this.codigo = this.codigo || '',
    this.cantidad_minima = this.cantidad_minima || 0,
    this.cantidad_maxima = this.cantidad_maxima || 0,
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): PromotionList{
    const promotionList = new PromotionList(data);
    const {id, tipo_servicios_id, tipo_servicios_nombre, nombre, descripcion, tipo_descuento, descuento, fecha_inicio, fecha_fin, codigo, cantidad_minima, cantidad_maxima, is_active, created_at, updated_at, deleted_at} = promotionList;
    return {id, tipo_servicios_id, tipo_servicios_nombre, nombre, descripcion, tipo_descuento, descuento, fecha_inicio, fecha_fin, codigo, cantidad_minima, cantidad_maxima, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): PromotionList[]{
    return dataArray.map((data) => PromotionList.cast(data));
  }
}