import { Model } from "./model";

export class Person extends Model{
  public id: number;
  public paises_id: number;
  public codigo_ubigeo: string;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public tipo_documentos_id: number;
  public documento: string;
  public reverso_documento: string;
  public fecha_nacimiento: string;
  public telefono: string;
  public correo: string;
  public direccion: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.paises_id = this.paises_id || null;
    this.nombres = this.nombres || null;
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.tipo_documentos_id = this.tipo_documentos_id || null;
    this.documento = this.documento || '';
    this.reverso_documento = this.reverso_documento || '';
    this.fecha_nacimiento = this.fecha_nacimiento || null;
    this.telefono = this.telefono || '';
    this.correo = this.correo || '';
    this.direccion = this.direccion || '';
  }

  public static cast(data: object): Person{
    const obj = new Person(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      nombres: obj.nombres,
      apellido_paterno: obj.apellido_paterno,
      apellido_materno: obj.apellido_materno,
      codigo_ubigeo: obj.codigo_ubigeo,
      tipo_documentos_id: obj.tipo_documentos_id,
      documento: obj.documento,
      reverso_documento: obj.reverso_documento,
      fecha_nacimiento: obj.fecha_nacimiento,
      telefono: obj.telefono,
      correo: obj.correo,
      direccion: obj.direccion
    };
  }

  public static casts(dataArray: object[]): Person[]{
    return dataArray.map((data) => Person.cast(data));
  }
}

export class PersonList extends Model{
  public id: number;
  public paises_id: number;
  public paises_nombre: string;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public codigo_ubigeo: string;
  public tipo_documentos_id: number;
  public tipo_documentos_nombre: string;
  public tipo_documentos_abreviacion: string;
  public documento: string;
  public reverso_documento: string;
  public fecha_nacimiento: string;
  public telefono: string;
  public correo: string;
  public direccion: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.paises_id = this.paises_id || 0;
    this.paises_nombre = this.paises_nombre || '';
    this.nombres = this.nombres || null;
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.tipo_documentos_nombre = this.tipo_documentos_nombre || '';
    this.tipo_documentos_abreviacion = this.tipo_documentos_abreviacion || '';
    this.documento = this.documento || '';
    this.reverso_documento = this.reverso_documento || '';
    this.fecha_nacimiento = this.fecha_nacimiento || '';
    this.telefono = this.telefono || '';
    this.correo = this.correo || '';
    this.direccion = this.direccion || '';
  }

  public static cast(data: object): PersonList{
    const obj = new PersonList(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      paises_nombre: obj.paises_nombre,
      nombres: obj.nombres,
      apellido_paterno: obj.apellido_paterno,
      apellido_materno: obj.apellido_materno,
      codigo_ubigeo: obj.codigo_ubigeo,
      tipo_documentos_id: obj.tipo_documentos_id,
      tipo_documentos_nombre: obj.tipo_documentos_nombre,
      tipo_documentos_abreviacion: obj.tipo_documentos_abreviacion,
      documento: obj.documento,
      reverso_documento: obj.reverso_documento,
      fecha_nacimiento: obj.fecha_nacimiento,
      telefono: obj.telefono,
      correo: obj.correo,
      direccion: obj.direccion
    };
  }

  public static casts(dataArray: object[]): PersonList[]{
    return dataArray.map((data) => PersonList.cast(data));
  }
}