import { Model } from "./model";

export class Call extends Model{
  public id: number;
  public numero: number;
  public operadores_id: number;
  public operadores_llamo_id: number;
  public tipificaciones_llamadas_id: number;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public direccion: string;
  public permanencia: boolean;
  public permanencia_tiempo: string;
  public tipo_estados_id: number;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.numero = this.numero || 0;
    this.operadores_id = this.operadores_id || null;
    this.operadores_llamo_id = this.operadores_llamo_id || null;
    this.tipificaciones_llamadas_id = this.tipificaciones_llamadas_id || null;
    this.nombres = this.nombres || '';
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.direccion = this.direccion || '';
    this.permanencia = this.permanencia || false;
    this.permanencia_tiempo = this.permanencia_tiempo || '';
    this.tipo_estados_id = this.tipo_estados_id || 0;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Call{
    const call = new Call(data);
    const {
      id,
      numero,
      operadores_id,
      operadores_llamo_id,
      tipificaciones_llamadas_id,
      nombres,
      apellido_paterno,
      apellido_materno,
      direccion,
      permanencia,
      permanencia_tiempo,
      tipo_estados_id,
      is_active
    } = call;

    return {
      id,
      numero,
      operadores_id,
      operadores_llamo_id,
      tipificaciones_llamadas_id,
      nombres,
      apellido_paterno,
      apellido_materno,
      direccion,
      permanencia,
      permanencia_tiempo,
      tipo_estados_id,
      is_active
    };
  }

  public static casts(dataArray: object[]): Call[]{
    return dataArray.map((data) => Call.cast(data));
  }
}

export class CallList extends Model{
  public index: number;
  public id: number;
  public numero: number;
  public operadores_id: number;
  public operadores_nombre: string;
  public operadores_llamo_id: number;
  public operadores_llamo_nombre: string;
  public tipificaciones_llamadas_id: number;
  public tipificaciones_llamadas_nombre: string;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public direccion: string;
  public permanencia: boolean;
  public permanencia_tiempo: string;
  public tipo_estados_id: number;
  public tipo_estados_nombre: string;
  public is_active: boolean;
  public user_create_id: number;
  public user_update_id: number;
  public user_delete_id: number;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;
  constructor(data?: object){
    super(data);
    this.index = this.index || 0;
    this.id = this.id || 0;
    this.numero = this.numero || 0;
    this.operadores_id = this.operadores_id || undefined;
    this.operadores_nombre = this.operadores_nombre || '';
    this.operadores_llamo_id = this.operadores_llamo_id || undefined;
    this.operadores_llamo_nombre = this.operadores_llamo_nombre || '';
    this.tipificaciones_llamadas_id = this.tipificaciones_llamadas_id || undefined;
    this.tipificaciones_llamadas_nombre = this.tipificaciones_llamadas_nombre || '';
    this.nombres = this.nombres || '';
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.direccion = this.direccion || '';
    this.permanencia = this.permanencia || false;
    this.permanencia_tiempo = this.permanencia_tiempo || '';
    this.tipo_estados_id = this.tipo_estados_id || 0;
    this.tipo_estados_nombre = this.tipo_estados_nombre || '';
    this.is_active = this.is_active || true;
    this.user_create_id = this.user_create_id || 0;
    this.user_update_id = this.user_update_id || 0;
    this.user_delete_id = this.user_delete_id || 0;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): CallList{
    const advertisementList = new CallList(data);
    const {
      index,
      id,
      numero,
      operadores_id,
      operadores_nombre,
      operadores_llamo_id,
      operadores_llamo_nombre,
      tipificaciones_llamadas_id,
      tipificaciones_llamadas_nombre,
      nombres,
      apellido_paterno,
      apellido_materno,
      direccion,
      permanencia,
      permanencia_tiempo,
      tipo_estados_id,
      tipo_estados_nombre,
      is_active, 
      user_create_id, 
      user_update_id, 
      user_delete_id, 
      created_at, 
      updated_at, 
      deleted_at 
    } = advertisementList;

    return {
      index,
      id,
      numero,
      operadores_id,
      operadores_nombre,
      operadores_llamo_id,
      operadores_llamo_nombre,
      tipificaciones_llamadas_id,
      tipificaciones_llamadas_nombre,
      nombres,
      apellido_paterno,
      apellido_materno,
      direccion,
      permanencia,
      permanencia_tiempo,
      tipo_estados_id,
      tipo_estados_nombre,
      is_active, 
      user_create_id, 
      user_update_id, 
      user_delete_id, 
      created_at, 
      updated_at, 
      deleted_at 
    };
  }

  public static casts(dataArray: object[]): CallList[]{
    return dataArray.map((data) => CallList.cast(data));
  }
}
