import { Model } from "../model";

export class Member extends Model{
  public id: number;
  public grupos_id: number;
  public usuarios_id: number;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.grupos_id = this.grupos_id || 0;
    this.usuarios_id = this.usuarios_id || 0;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Member{
    const member = new Member(data);
    const {id, grupos_id, usuarios_id, is_active} = member;
    return {id, grupos_id, usuarios_id, is_active};
  }

  public static casts(dataArray: object[]): Member[]{
    return dataArray.map((data) => Member.cast(data));
  }
}

export class MemberList extends Model{
  public id: number;
  public grupos_id: number;
  public usuarios_id: number;
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
  public user_create_id: number;
  public user_update_id: number;
  public user_delete_id: number;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.grupos_id = this.grupos_id || 0;
    this.usuarios_id = this.usuarios_id || 0;
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
    this.nombre_usuario = this.nombre_usuario || '';
    this.is_active = this.is_active || false;
    this.user_create_id = this.user_create_id || 0;
    this.user_update_id = this.user_update_id || 0;
    this.user_delete_id = this.user_delete_id || 0;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): MemberList{
    const memberList = new MemberList(data);
    const { id, grupos_id, usuarios_id, nombres, apellido_paterno, apellido_materno, paises_id, personas_id, tipo_usuarios_id, tipo_documentos_id, paises_nombre, tipo_usuarios_nombre, tipo_documentos_abreviacion, documento, nombre_usuario, is_active, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at } = memberList;
    return {id, grupos_id, usuarios_id, nombres, apellido_paterno, apellido_materno, paises_id, personas_id, tipo_usuarios_id, tipo_documentos_id, paises_nombre, tipo_usuarios_nombre, tipo_documentos_abreviacion, documento, nombre_usuario, is_active, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): MemberList[]{
    return dataArray.map((data) => MemberList.cast(data));
  }
}