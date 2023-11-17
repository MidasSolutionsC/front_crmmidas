import { Model } from "./model";

export class IpAllowed extends Model{
  public id: number;
  public sedes_id: number;
  public ip: string;
  public descripcion: string;
  public fecha_expiracion: string;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.sedes_id = this.sedes_id || null;
    this.ip = this.ip || null;
    this.descripcion = this.descripcion || null;
    this.fecha_expiracion = this.fecha_expiracion || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): IpAllowed{
    const obj = new IpAllowed(data);
    return {
      id: obj.id, 
      sedes_id: obj.sedes_id,
      ip: obj.ip,
      descripcion: obj.descripcion,
      fecha_expiracion: obj.fecha_expiracion,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): IpAllowed[]{
    return dataArray.map((data) => IpAllowed.cast(data));
  }
}

export class IpAllowedList extends Model{
  public id: number;
  public sedes_id: number;
  public ip: string;
  public descripcion: string;
  public fecha: string;
  public hora: string;
  public fecha_expiracion: string;
  public is_active: boolean | number;
  public user_create_id: number;
  public user_update_id: number;
  public user_delete_id: number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.sedes_id = this.sedes_id || null;
    this.ip = this.ip || null;
    this.descripcion = this.descripcion || null;
    this.fecha_expiracion = this.fecha_expiracion || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): IpAllowedList{
    const obj = new IpAllowedList(data);
    return {
      id: obj.id, 
      sedes_id: obj.sedes_id,
      ip: obj.ip,
      descripcion: obj.descripcion,
      fecha: obj.fecha,
      hora: obj.hora,
      fecha_expiracion: obj.fecha_expiracion,
      user_create_id: obj.user_create_id,
      user_update_id: obj.user_update_id,
      user_delete_id: obj.user_delete_id,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): IpAllowedList[]{
    return dataArray.map((data) => IpAllowedList.cast(data));
  }
}
