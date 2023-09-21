import { Model } from "./model";

export class Company extends Model{
  public id: number;
  public paises_id: number;
  public codigo_ubigeo: string;
  public razon_social: string;
  public nombre_comercial: string;
  public descripcion: string;
  public tipo_documentos_id: number;
  public documento: string;
  public tipo_empresa: string;
  public direccion: string;
  public ciudad: string;
  public telefono: string;
  public correo: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.paises_id = this.paises_id || null;
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.razon_social = this.razon_social || '';
    this.nombre_comercial = this.nombre_comercial || '';
    this.descripcion = this.descripcion || '';
    this.tipo_documentos_id = this.tipo_documentos_id || null;
    this.documento = this.documento || '';
    this.tipo_empresa = this.tipo_empresa || '';
    this.direccion = this.direccion || '';
    this.ciudad = this.ciudad || '';
    this.telefono = this.telefono || '';
    this.correo = this.correo || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Company{
    const obj = new Company(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      codigo_ubigeo: obj.codigo_ubigeo,
      razon_social: obj.razon_social,
      nombre_comercial: obj.nombre_comercial,
      descripcion: obj.descripcion,
      tipo_documentos_id: obj.tipo_documentos_id,
      documento: obj.documento,
      tipo_empresa: obj.tipo_empresa,
      direccion: obj.direccion,
      ciudad: obj.direccion,
      telefono: obj.telefono,
      correo: obj.correo,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): Company[]{
    return dataArray.map((data) => Company.cast(data));
  }
}

export class CompanyList extends Model{
  public id: number;
  public paises_id: number;
  public paises_nombre: string;
  public codigo_ubigeo: string;
  public razon_social: string;
  public nombre_comercial: string;
  public descripcion: string;
  public tipo_documentos_id: number;
  public tipo_documentos_nombre: string;
  public tipo_documentos_abreviacion: string;
  public documento: string;
  public tipo_empresa: string;
  public direccion: string;
  public ciudad: string;
  public telefono: string;
  public correo: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.paises_id = this.paises_id || 0;
    this.paises_nombre = this.paises_nombre || '';
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.razon_social = this.razon_social || '';
    this.nombre_comercial = this.nombre_comercial || '';
    this.descripcion = this.descripcion || '';
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.tipo_documentos_nombre = this.tipo_documentos_nombre || '';
    this.tipo_documentos_abreviacion = this.tipo_documentos_abreviacion || '';
    this.documento = this.documento || '';
    this.tipo_empresa = this.tipo_empresa || '';
    this.direccion = this.direccion || '';
    this.ciudad = this.ciudad || '';
    this.telefono = this.telefono || '';
    this.correo = this.correo || '';
    this.is_active = this.is_active || true;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): CompanyList{
    const obj = new CompanyList(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      paises_nombre: obj.paises_nombre,
      codigo_ubigeo: obj.codigo_ubigeo,
      razon_social: obj.razon_social,
      nombre_comercial: obj.nombre_comercial,
      descripcion: obj.descripcion,
      tipo_documentos_id: obj.tipo_documentos_id,
      tipo_documentos_nombre: obj.tipo_documentos_nombre,
      tipo_documentos_abreviacion: obj.tipo_documentos_abreviacion,
      documento: obj.documento,
      tipo_empresa: obj.tipo_empresa,
      direccion: obj.direccion,
      ciudad: obj.direccion,
      telefono: obj.telefono,
      correo: obj.correo,
      is_active: obj.is_active,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
      deleted_at: obj.deleted_at
    };
  }

  public static casts(dataArray: object[]): CompanyList[]{
    return dataArray.map((data) => CompanyList.cast(data));
  }
}
