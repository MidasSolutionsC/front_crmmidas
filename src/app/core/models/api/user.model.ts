import { IdentificationDocument, IdentificationDocumentList } from "./identification-document.model";
import { Model } from "./model";

export class User extends Model {
  public id: number;
  public personas_id: number;
  public tipo_usuarios_id: number;
  public tipo_usuario: string;
  public nombre_usuario: string;
  public clave: string;
  public foto_perfil: string;
  public session_activa: boolean;
  public is_active: boolean;
  public ultima_conexion: string;
  public api_token: string;
  public expires_at: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object) {
    super(data);
    this.id = this.id || 0;
    this.personas_id = this.personas_id || 0;
    this.tipo_usuarios_id = this.tipo_usuarios_id || 0;
    this.nombre_usuario = this.nombre_usuario || '';
    this.clave = this.clave || '';
    this.foto_perfil = this.foto_perfil || '';
    this.session_activa = this.session_activa || false;
    this.is_active = this.is_active || false;
    this.ultima_conexion = this.ultima_conexion || '';
    this.api_token = this.api_token || '';
    this.expires_at = this.expires_at || '';
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
    this.tipo_usuario = this.tipo_usuario || '';

  }

  public static cast(data: object): User {
    return new User(data);
  }

  public static casts(dataArray: object[]): User[] {
    return dataArray.map((data) => User.cast(data));
  }
}

export class UserList extends Model {
  public id: number;
  public personas_id: number;
  public tipo_usuarios_id: number;
  public tipo_usuario: string;
  public nombre_usuario: string;
  public clave: string;
  public foto_perfil: string;
  public session_activa: boolean;
  public is_active: boolean;
  public ultima_conexion: string;
  public api_token: string;
  public expires_at: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object) {
    super(data);
    this.id = this.id || 0;
    this.personas_id = this.personas_id || 0;
    this.tipo_usuarios_id = this.tipo_usuarios_id || 0;
    this.nombre_usuario = this.nombre_usuario || '';
    this.clave = this.clave || '';
    this.foto_perfil = this.foto_perfil || '';
    this.session_activa = this.session_activa || false;
    this.is_active = this.is_active || false;
    this.ultima_conexion = this.ultima_conexion || '';
    this.api_token = this.api_token || '';
    this.expires_at = this.expires_at || '';
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
    this.tipo_usuario = this.tipo_usuario || '';

  }

  public static cast(data: object): User {
    return new UserList(data);
  }

  public static casts(dataArray: object[]): User[] {
    return dataArray.map((data) => UserList.cast(data));
  }
}

// Desde el inicio
export class UserPersonSignup extends Model {
  public id: number;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public paises_id: number;
  public tipo_documentos_id: number;
  public documento: string;
  public nombre_usuario: string;
  public clave: string;
  public identificaciones?: IdentificationDocument[];

  constructor(data?: object) {
    super(data);
    this.id = this.id || 0;
    this.nombres = this.nombres || '';
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.paises_id = this.paises_id || 0;
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.documento = this.documento || '';
    this.nombre_usuario = this.nombre_usuario || '';
    this.clave = this.clave || '';
    this.identificaciones = this.identificaciones || [];
  }

  public static cast(data: object): UserPersonSignup {
    const obj = new UserPersonSignup(data);
    return { 
      id: obj.id, 
      nombres: obj.nombres, 
      apellido_paterno: obj.apellido_materno, 
      apellido_materno: obj.apellido_materno, 
      paises_id: obj.paises_id, 
      tipo_documentos_id: obj.tipo_documentos_id, 
      documento: obj.documento, 
      nombre_usuario: obj.nombre_usuario, 
      clave: obj.clave,
      identificaciones: obj.identificaciones,
    };
  }

  public static casts(dataArray: object[]): UserPersonSignup[] {
    return dataArray.map((data) => UserPersonSignup.cast(data));
  }
}

// Desde el main
export class UserPerson extends Model {
  public id: number;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public paises_id: number;
  public tipo_usuarios_id: number;
  public tipo_documentos_id: number;
  public documento: string;
  public nombre_usuario: string;
  public clave: string;
  public identificaciones?: IdentificationDocument[];

  constructor(data?: object) {
    super(data);
    this.id = this.id || 0;
    this.nombres = this.nombres || '';
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.paises_id = this.paises_id || 0;
    this.tipo_usuarios_id = this.tipo_usuarios_id || 0;
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.documento = this.documento || '';
    this.nombre_usuario = this.nombre_usuario || '';
    this.clave = this.clave || '';
    this.identificaciones = this.identificaciones || [];
  }

  public static cast(data: object): UserPerson {
    const userPerson = new UserPerson(data);
    const { id, nombres, apellido_paterno, apellido_materno, paises_id, tipo_usuarios_id, tipo_documentos_id, documento, nombre_usuario, clave, identificaciones } = userPerson;
    return { id, nombres, apellido_paterno, apellido_materno, paises_id, tipo_usuarios_id, tipo_documentos_id, documento, nombre_usuario, clave, identificaciones };
  }

  public static casts(dataArray: object[]): UserPerson[] {
    return dataArray.map((data) => UserPerson.cast(data));
  }
}


export class UserPersonList extends Model {
  public id: number;
  public index: number;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public paises_id: number;
  public personas_id: number;
  public tipo_usuarios_id: number;
  public tipo_documentos_id: number;
  public paises_nombre: string;
  public tipo_usuarios_nombre: string;
  public tipo_documentos_abreviacion: string;
  public documento: string;
  public nombre_usuario: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;
  public identificaciones?: IdentificationDocumentList[];


  constructor(data?: object) {
    super(data);
    this.id = this.id || 0;
    this.index = this.index || 0;
    this.nombres = this.nombres || '';
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.paises_id = this.paises_id || 0;
    this.personas_id = this.personas_id || 0;
    this.tipo_usuarios_id = this.tipo_usuarios_id || 0;
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.paises_nombre = this.paises_nombre || '';
    this.tipo_usuarios_nombre = this.tipo_usuarios_nombre || '';
    this.tipo_documentos_abreviacion = this.tipo_documentos_abreviacion || '';
    this.documento = this.documento || '';
    this.nombre_usuario = this.nombre_usuario || '';;
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
    this.identificaciones = this.identificaciones || [];
  }

  public static cast(data: object): UserPersonList {
    const obj = new UserPersonList(data);
    return {
      id: obj.id,
      index: obj.index,
      nombres: obj.nombres,
      apellido_paterno: obj.apellido_paterno,
      apellido_materno: obj.apellido_materno,
      paises_id: obj.paises_id,
      personas_id: obj.personas_id,
      tipo_usuarios_id: obj.tipo_usuarios_id,
      tipo_documentos_id: obj.tipo_documentos_id,
      paises_nombre: obj.paises_nombre,
      tipo_usuarios_nombre: obj.tipo_usuarios_nombre,
      tipo_documentos_abreviacion: obj.tipo_documentos_abreviacion,
      documento: obj.documento,
      nombre_usuario: obj.nombre_usuario,
      is_active: obj.is_active,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
      deleted_at: obj.deleted_at,
      identificaciones: obj.identificaciones,
    };
  }

  public static casts(dataArray: object[]): UserPersonList[] {
    return dataArray.map((data) => UserPersonList.cast(data));
  }
}