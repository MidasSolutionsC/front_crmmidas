import { Model } from "./model";

export class Call extends Model{
  public id: number;
  public numero: number;
  public direccion: string;
  public operador: string;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public tipificacion: string;
  public tiene_permanencia: boolean;
  public cuanto_queda_permanencia: number;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.numero = this.numero || 0;
    this.direccion = this.direccion || '';
    this.operador = this.operador || '';
    this.nombres = this.nombres || '';
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.tipificacion = this.tipificacion || '';
    this.tiene_permanencia = this.tiene_permanencia || true;
    this.cuanto_queda_permanencia = this.cuanto_queda_permanencia || 0;
  }

  public static cast(data: object): Call{
    const call = new Call(data);
    const {id, numero, direccion, operador, nombres, apellido_paterno, apellido_materno, tipificacion, tiene_permanencia, cuanto_queda_permanencia} = call;
    return {id, numero, direccion, operador, nombres, apellido_paterno, apellido_materno, tipificacion, tiene_permanencia, cuanto_queda_permanencia};
  }

  public static cats(dataArray: object[]): Call[]{
    return dataArray.map((data) => Call.cast(data));
  }
}

export class CallList extends Model{
  public id: number;
  public numero: number;
  public direccion: string;
  public operador: string;
  public nombres: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public tipificacion: string;
  public tiene_permanencia: boolean;
  public cuanto_queda_permanencia: number;
  public user_create_id: number;
  public user_update_id: number;
  public user_delete_id: number;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.numero = this.numero || 0;
    this.direccion = this.direccion || '';
    this.operador = this.operador || '';
    this.nombres = this.nombres || '';
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.tipificacion = this.tipificacion || '';
    this.tiene_permanencia = this.tiene_permanencia || true;
    this.cuanto_queda_permanencia = this.cuanto_queda_permanencia || 0;
    this.user_create_id = this.user_create_id || 0;
    this.user_update_id = this.user_update_id || 0;
    this.user_delete_id = this.user_delete_id || 0;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): CallList{
    const advertisementList = new CallList(data);
    const { id, numero, direccion, operador, nombres, apellido_paterno, apellido_materno, tipificacion, tiene_permanencia, cuanto_queda_permanencia, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at } = advertisementList;
    return {id, numero, direccion, operador, nombres, apellido_paterno, apellido_materno, tipificacion, tiene_permanencia, cuanto_queda_permanencia, user_create_id, user_update_id, user_delete_id, created_at, updated_at, deleted_at};
  }

  public static cats(dataArray: object[]): CallList[]{
    return dataArray.map((data) => CallList.cast(data));
  }
}
