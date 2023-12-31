import { CountryList } from "../country.model";
import { Model } from "../model";

export class Campus extends Model{
  public id: number;
  public paises_id: number;
  public codigo_ubigeo: string;
  public nombre: string;
  public ciudad: string;
  public direccion: string;
  public codigo_postal: string;
  public telefono: string;
  public correo: string;
  public responsable: string;
  public fecha_apertura: string;
  public logo: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.paises_id = this.paises_id || 0;
    this.nombre = this.nombre || '';
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.ciudad = this.ciudad || '';
    this.direccion = this.direccion || '';
    this.codigo_postal = this.codigo_postal || '';
    this.telefono = this.telefono || '';
    this.correo = this.correo || '';
    this.responsable = this.responsable || '';
    this.fecha_apertura = this.fecha_apertura || '';
    this.logo = this.logo || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Campus{
    const campus = new Campus(data);
    const {id, paises_id, nombre, codigo_ubigeo, ciudad, direccion, codigo_postal, telefono, correo, responsable, fecha_apertura, logo, is_active} = campus;
    return {id, paises_id, nombre, codigo_ubigeo, ciudad, direccion, codigo_postal, telefono, correo, responsable, fecha_apertura, logo, is_active};
  }

  public static casts(dataArray: object[]): Campus[]{
    return dataArray.map((data) => Campus.cast(data));
  }
}


export class CampusList extends Model{
  public id: number;
  public paises_id: number;
  public paises_nombre: string;
  public country?: CountryList;
  public ubigeos_ciudad: string;
  public codigo_ubigeo: string;
  public nombre: string;
  public ciudad: string;
  public direccion: string;
  public codigo_postal: string;
  public telefono: string;
  public correo: string;
  public responsable: string;
  public fecha_apertura: string;
  public logo: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;


  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.paises_id = this.paises_id || 0;
    this.nombre = this.nombre || '';
    this.paises_nombre = this.paises_nombre || '';
    this.country = this.country || null;
    this.ubigeos_ciudad = this.ubigeos_ciudad || '';
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.ciudad = this.ciudad || '';
    this.direccion = this.direccion || '';
    this.codigo_postal = this.codigo_postal || '';
    this.telefono = this.telefono || '';
    this.correo = this.correo || '';
    this.responsable = this.responsable || '';
    this.fecha_apertura = this.fecha_apertura || '';
    this.logo = this.logo || '';
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): CampusList{
    const campusList = new CampusList(data);
    return {
      id: campusList.id,
      paises_id: campusList.paises_id,
      nombre: campusList.nombre,
      paises_nombre: campusList.paises_nombre,
      country: campusList.country,
      ubigeos_ciudad: campusList.ubigeos_ciudad,
      codigo_ubigeo: campusList.codigo_ubigeo,
      ciudad: campusList.ciudad,
      direccion: campusList.direccion,
      codigo_postal: campusList.codigo_postal,
      telefono: campusList.telefono,
      correo: campusList.correo,
      responsable: campusList.responsable,
      fecha_apertura: campusList.fecha_apertura,
      logo: campusList.logo,
      is_active: campusList.is_active,
      created_at: campusList.created_at,
      updated_at: campusList.updated_at,
      deleted_at: campusList.deleted_at
    }
  }

  public static casts(dataArray: object[]): CampusList[]{
    return dataArray.map((data) => CampusList.cast(data));
  }
}

