import { Model } from "./model";

export class Client extends Model{
  public id: number;
  public personas_id: number;
  public empresas_id: number;
  public tipo_cliente: string;
  public cif: string;
  public codigo_carga: string;
  public segmento_vodafond: string;
  // public cta_bco: string;
  public persona_juridica: boolean;
  public is_active: boolean;
  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.personas_id = this.personas_id || null;
    this.empresas_id = this.empresas_id || null;
    this.tipo_cliente = this.tipo_cliente || null;
    this.cif = this.cif || '';
    this.codigo_carga = this.codigo_carga || '';
    this.segmento_vodafond = this.segmento_vodafond || '';
    // this.cta_bco = this.cta_bco || '';
    this.persona_juridica = this.persona_juridica || false;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Client{
    const obj = new Client(data);

    return {
      id: obj.id,
      personas_id: obj.personas_id,
      empresas_id: obj.empresas_id,
      tipo_cliente: obj.tipo_cliente,
      cif: obj.cif,
      codigo_carga: obj.codigo_carga,
      segmento_vodafond: obj.segmento_vodafond,
      // cta_bco: obj.cta_bco,
      persona_juridica: obj.persona_juridica,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): Client[]{
    return dataArray.map((data) => Client.cast(data));
  }
}

export class ClientList extends Model{
  public id: number;
  public personas_id: number;
  public empresas_id: number;
  public tipo_cliente: string;
  public cif: string;
  public codigo_carga: string;
  public segmento_vodafond: string;
  public cta_bco: string;
  public persona_juridica: boolean;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.personas_id = this.personas_id || 0;
    this.empresas_id = this.empresas_id || 0;
    this.tipo_cliente = this.tipo_cliente || null;
    this.cif = this.cif || '';
    this.codigo_carga = this.codigo_carga || '';
    this.segmento_vodafond = this.segmento_vodafond || '';
    this.cta_bco = this.cta_bco || '';
    this.persona_juridica = this.persona_juridica || false;
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): ClientList{
    const obj = new ClientList(data);

    return {
      id: obj.id,
      personas_id: obj.personas_id,
      empresas_id: obj.empresas_id,
      tipo_cliente: obj.tipo_cliente,
      cif: obj.cif,
      codigo_carga: obj.codigo_carga,
      segmento_vodafond: obj.segmento_vodafond,
      cta_bco: obj.cta_bco,
      persona_juridica: obj.persona_juridica,
      is_active: obj.is_active,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
      deleted_at: obj.deleted_at
    };
  }

  public static casts(dataArray: object[]): ClientList[]{
    return dataArray.map((data) => ClientList.cast(data));
  }
}

// Desde el main
export class ClientPerson extends Model{
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

  constructor(data?: object){
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
  }

  public static cast(data: object): ClientPerson{
    const clientPerson = new ClientPerson(data);
    const {id, nombres, apellido_paterno, apellido_materno, paises_id, tipo_usuarios_id, tipo_documentos_id, documento, nombre_usuario, clave} = clientPerson;
    return {id, nombres, apellido_paterno, apellido_materno, paises_id, tipo_usuarios_id, tipo_documentos_id, documento, nombre_usuario, clave};
  }

  public static casts(dataArray: object[]): ClientPerson[]{
    return dataArray.map((data) => ClientPerson.cast(data));
  }
}


export class ClientPersonList extends Model{
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


  constructor(data?: object){
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
  }

  public static cast(data: object): ClientPersonList{
    const clientPersonList = new ClientPersonList(data);
    const {id, index, nombres, apellido_paterno, apellido_materno, paises_id, personas_id, tipo_usuarios_id, tipo_documentos_id, paises_nombre, tipo_usuarios_nombre, tipo_documentos_abreviacion, documento, nombre_usuario, is_active, created_at, updated_at, deleted_at} = clientPersonList;
    return {id, index, nombres, apellido_paterno, apellido_materno, paises_id, personas_id, tipo_usuarios_id, tipo_documentos_id, paises_nombre, tipo_usuarios_nombre, tipo_documentos_abreviacion, documento, nombre_usuario, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): ClientPersonList[]{
    return dataArray.map((data) => ClientPersonList.cast(data));
  }
}