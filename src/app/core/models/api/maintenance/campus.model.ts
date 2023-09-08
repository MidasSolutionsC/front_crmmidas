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

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.paises_id = this.paises_id || 0;
    this.nombre = this.nombre || '';
    this.paises_nombre = this.paises_nombre || '';
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
  }

  public static cast(data: object): CampusList{
    const campusList = new CampusList(data);
    const {id, paises_id, nombre, paises_nombre, ubigeos_ciudad, codigo_ubigeo, ciudad, direccion, codigo_postal, telefono, correo, responsable, fecha_apertura, logo, is_active} = campusList;
    return {id, paises_id, nombre, paises_nombre, ubigeos_ciudad, codigo_ubigeo, ciudad, direccion, codigo_postal, telefono, correo, responsable, fecha_apertura, logo, is_active};
  }

  public static casts(dataArray: object[]): CampusList[]{
    return dataArray.map((data) => CampusList.cast(data));
  }
}

