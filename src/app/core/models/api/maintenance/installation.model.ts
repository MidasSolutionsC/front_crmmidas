import { Model } from "../model";

export class Installation extends Model{
  public id: number;
  public ventas_id: number;
  public direcciones_id?: number; // DIRECCIÓN DEL CLIENTE
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
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.direcciones_id = this.direcciones_id || null;
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
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Installation{
    const installation = new Installation(data);
    const {
      id,
      ventas_id,
      direcciones_id,
      tipo,
      direccion,
      numero,
      escalera,
      portal,
      planta,
      puerta,
      codigo_postal,
      localidad,
      provincia,
      is_active
    } = installation;

    return {
      id,
      ventas_id,
      direcciones_id,
      tipo,
      direccion,
      numero,
      escalera,
      portal,
      planta,
      puerta,
      codigo_postal,
      localidad,
      provincia,
      is_active
    };
  }

  public static casts(dataArray: object[]): Installation[]{
    return dataArray.map((data) => Installation.cast(data));
  }
}

export class InstallationList extends Model{
  public id: number;
  public ventas_id: number;
  public direcciones_id?: number;
  public tipo: string;
  public direccion: string;
  public numero: string;
  public escalera: string;
  public portal: string;
  public planta: string;
  public puerta: string;
  public direccion_completo: string;
  public codigo_postal: string;
  public localidad: string;
  public provincia: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.direcciones_id = this.direcciones_id || null;
    this.tipo = this.tipo || '';
    this.direccion = this.direccion || '';
    this.numero = this.numero || '';
    this.escalera = this.escalera || '';
    this.portal = this.portal || '';
    this.planta = this.planta || '';
    this.puerta = this.puerta || '';
    this.direccion_completo = this.direccion_completo || '';
    this.codigo_postal = this.codigo_postal || '';
    this.localidad = this.localidad || '';
    this.provincia = this.provincia || '';
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): InstallationList{
    const installationList = new InstallationList(data);
    const {
      id,
      ventas_id,
      direcciones_id,
      tipo,
      direccion,
      numero,
      escalera,
      portal,
      planta,
      puerta,
      direccion_completo,
      codigo_postal,
      localidad,
      provincia,
      is_active, 
      created_at, 
      updated_at, 
      deleted_at
    } = installationList;

    return {
      id,
      ventas_id,
      direcciones_id,
      tipo,
      direccion,
      numero,
      escalera,
      portal,
      planta,
      puerta,
      direccion_completo,
      codigo_postal,
      localidad,
      provincia,
      is_active, 
      created_at, 
      updated_at, 
      deleted_at
    };
  }

  public static casts(dataArray: object[]): InstallationList[]{
    return dataArray.map((data) => InstallationList.cast(data));
  }
}