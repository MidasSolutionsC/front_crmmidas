import { Model } from "../model";

export class Group extends Model{
  public id: number;
  public sedes_id: number;
  public nombre: string;
  public descripcion: string;
  public integrantes: any;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.sedes_id = this.sedes_id || 0;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.integrantes = this.integrantes || null;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Group{
    const grupo = new Group(data);
    const {id, sedes_id, nombre, descripcion, integrantes, is_active} = grupo;
    return {id, sedes_id, nombre, descripcion, integrantes, is_active};
  }

  public static casts(dataArray: object[]): Group[]{
    return dataArray.map((data) => Group.cast(data));
  }
}

export class GroupList extends Model{
  public id: number;
  public nombre: string;
  public sedes_nombre: string;
  public descripcion: string;
  public usuarios_create_nombre_usuario: string;
  public usuarios_update_nombre_usuario: string;
  public personas_create_nombres: string;
  public personas_create_apellido_paterno: string;
  public personas_create_apellido_materno: string;
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
    this.sedes_nombre = this.sedes_nombre || '';
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.usuarios_create_nombre_usuario = this.usuarios_create_nombre_usuario || '';
    this.usuarios_update_nombre_usuario = this.usuarios_update_nombre_usuario || '';
    this.personas_create_nombres = this.personas_create_nombres || '';
    this.personas_create_apellido_paterno = this.personas_create_apellido_paterno || '';
    this.personas_create_apellido_materno = this.personas_create_apellido_materno || '';
    this.is_active = this.is_active || false;
    this.user_create_id = this.user_create_id || 0;
    this.user_update_id = this.user_update_id || 0;
    this.user_delete_id = this.user_delete_id || 0;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): GroupList{
    const groupList = new GroupList(data);
    const { 
      id,
      sedes_nombre, 
      nombre, 
      descripcion,
      usuarios_create_nombre_usuario, 
      usuarios_update_nombre_usuario, 
      personas_create_nombres, 
      personas_create_apellido_paterno, 
      personas_create_apellido_materno, 
      is_active, 
      user_create_id, 
      user_update_id, 
      user_delete_id, 
      created_at, 
      updated_at, 
      deleted_at 
    } = groupList;

    return {
      id,
      sedes_nombre, 
      nombre, 
      descripcion,
      usuarios_create_nombre_usuario, 
      usuarios_update_nombre_usuario,
      personas_create_nombres, 
      personas_create_apellido_paterno, 
      personas_create_apellido_materno, 
      is_active, user_create_id,
      user_update_id, 
      user_delete_id, 
      created_at, 
      updated_at, 
      deleted_at};
  }

  public static casts(dataArray: object[]): GroupList[]{
    return dataArray.map((data) => GroupList.cast(data));
  }
}