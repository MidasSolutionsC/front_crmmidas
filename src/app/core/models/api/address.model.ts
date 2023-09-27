import { Model } from "./model";

export class Address extends Model{
  public id: number;
  public empresas_id: number;
  public personas_id: number;
  public domicilio: string;
  public tipo: string;
  public direccion: string;
  public numero: string;
  public escalera: string;
  public portal: string;
  public planta: string;
  public puerta: string;
  public codigo_postal: string;
  public localidad: string;
  public provincia: string;
  public territorial: string;
  public is_primary: boolean | number;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.empresas_id = this.empresas_id || null;
    this.personas_id = this.personas_id || null;
    this.domicilio = this.domicilio || '';
    this.tipo = this.tipo || '';
    this.direccion = this.direccion || '';
    this.numero = this.numero || '';
    this.escalera = this.escalera || '';
    this.portal = this.portal || '';
    this.planta = this.planta || '';
    this.puerta = this.puerta || '';
    this.codigo_postal = this.codigo_postal || '';
    this.localidad = this.localidad || '';
    this.provincia = this.provincia || '';
    this.territorial = this.territorial || '';
    this.is_primary = this.is_primary || 0;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): Address{
    const obj = new Address(data);
    return {
      id: obj.id, 
      empresas_id: obj.empresas_id,
      personas_id: obj.personas_id,
      domicilio: obj.domicilio,
      tipo: obj.tipo,
      direccion: obj.direccion,
      numero: obj.numero,
      escalera: obj.escalera,
      portal: obj.portal,
      planta: obj.planta,
      puerta: obj.puerta,
      codigo_postal: obj.codigo_postal,
      localidad: obj.localidad,
      provincia: obj.provincia,
      territorial: obj.territorial,
      is_primary: obj.is_primary,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): Address[]{
    return dataArray.map((data) => Address.cast(data));
  }
}

export class AddressList extends Model{
  public id: number;
  public empresas_id: number;
  public personas_id: number;
  public domicilio: string;
  public tipo: string;
  public direccion: string;
  public direccion_completo: string;
  public numero: string;
  public escalera: string;
  public portal: string;
  public planta: string;
  public puerta: string;
  public codigo_postal: string;
  public localidad: string;
  public provincia: string;
  public territorial: string;
  public is_primary: boolean | number;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.empresas_id = this.empresas_id || null;
    this.personas_id = this.personas_id || null;
    this.domicilio = this.domicilio || null;
    this.tipo = this.tipo || '';
    this.direccion = this.direccion || '';
    this.direccion_completo = this.direccion_completo || '';
    this.numero = this.numero || '';
    this.escalera = this.escalera || '';
    this.portal = this.portal || '';
    this.planta = this.planta || '';
    this.puerta = this.puerta || '';
    this.codigo_postal = this.codigo_postal || '';
    this.localidad = this.localidad || '';
    this.provincia = this.provincia || '';
    this.territorial = this.territorial || '';
    this.is_primary = this.is_primary || 1;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): AddressList{
    const obj = new AddressList(data);
    return {
      id: obj.id, 
      empresas_id: obj.empresas_id,
      personas_id: obj.personas_id,
      domicilio: obj.domicilio,
      tipo: obj.tipo,
      direccion: obj.direccion,
      direccion_completo: obj.direccion_completo,
      numero: obj.numero,
      escalera: obj.escalera,
      portal: obj.portal,
      planta: obj.planta,
      puerta: obj.puerta,
      codigo_postal: obj.codigo_postal,
      localidad: obj.localidad,
      provincia: obj.provincia,
      territorial: obj.territorial,
      is_primary: obj.is_primary,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): AddressList[]{
    return dataArray.map((data) => AddressList.cast(data));
  }
}
