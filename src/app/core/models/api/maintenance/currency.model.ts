import { Model } from "../model";

export class Currency extends Model{
  public id: number;
  public paises_id: number;
  public nombre: string;
  public descripcion: string;
  public iso_code: string;
  public simbolo: string;
  public tasa_cambio: number;
  public fecha_actualizado: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.paises_id = this.paises_id || undefined;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.iso_code = this.iso_code || '';
    this.simbolo = this.simbolo || '';
    this.tasa_cambio = this.tasa_cambio || undefined;
    this.fecha_actualizado = this.fecha_actualizado || undefined;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Currency{
    const currency = new Currency(data);
    const {
      id,
      paises_id,
      nombre,
      descripcion,
      iso_code,
      simbolo,
      tasa_cambio,
      fecha_actualizado,
      is_active
    } = currency;

    return {
      id,
      paises_id,
      nombre,
      descripcion,
      iso_code,
      simbolo,
      tasa_cambio,
      fecha_actualizado,
      is_active
    };
  }

  public static casts(dataArray: object[]): Currency[]{
    return dataArray.map((data) => Currency.cast(data));
  }
}

export class CurrencyList extends Model{
  public id: number;
  public paises_id: number;
  public nombre: string;
  public descripcion: string;
  public iso_code: string;
  public simbolo: string;
  public tasa_cambio: number;
  public fecha_actualizado: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;


  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.paises_id = this.paises_id || undefined;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.iso_code = this.iso_code || '';
    this.simbolo = this.simbolo || '';
    this.tasa_cambio = this.tasa_cambio || undefined;
    this.fecha_actualizado = this.fecha_actualizado || '';
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): CurrencyList{
    const currencyList = new CurrencyList(data);
    const {
      id,
      paises_id,
      nombre,
      descripcion,
      iso_code,
      simbolo,
      tasa_cambio,
      fecha_actualizado,
      is_active,
      created_at,
      updated_at,
      deleted_at
    } = currencyList;

    return {
      id,
      paises_id,
      nombre,
      descripcion,
      iso_code,
      simbolo,
      tasa_cambio,
      fecha_actualizado,
      is_active,
      created_at,
      updated_at,
      deleted_at
    };
  }

  public static casts(dataArray: object[]): CurrencyList[]{
    return dataArray.map((data) => CurrencyList.cast(data));
  }
}