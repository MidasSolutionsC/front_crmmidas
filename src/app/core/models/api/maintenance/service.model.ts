import { Model } from "../model";

export class Service extends Model{
  public id: number;
  public tipo_servicios_id: number;
  public productos_id: number;
  public promociones_id: number;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.tipo_servicios_id = this.tipo_servicios_id || undefined;
    this.productos_id = this.productos_id || undefined;
    this.promociones_id = this.promociones_id || undefined;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Service{
    const service = new Service(data);
    const {
      id,
      tipo_servicios_id,
      productos_id,
      promociones_id,
      nombre,
      descripcion,
      is_active
    } = service;

    return {
      id,
      tipo_servicios_id,
      productos_id,
      promociones_id,
      nombre,
      descripcion,
      is_active
    };
  }

  public static casts(dataArray: object[]): Service[]{
    return dataArray.map((data) => Service.cast(data));
  }
}

export class ServiceList extends Model{
  public id: number;
  public tipo_servicios_id: number;
  public tipo_servicios_nombre: string;
  public productos_id: number;
  public productos_nombre: string;
  public promociones_id: number;
  public promociones_nombre: string;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.tipo_servicios_id = this.tipo_servicios_id || undefined;
    this.tipo_servicios_nombre = this.tipo_servicios_nombre || '';
    this.productos_id = this.productos_id || undefined;
    this.productos_nombre = this.productos_nombre || '';
    this.promociones_id = this.promociones_id || undefined;
    this.promociones_nombre = this.promociones_nombre || '';
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): ServiceList{
    const serviceList = new ServiceList(data);
    const {
      id,
      tipo_servicios_id,
      tipo_servicios_nombre,
      productos_id,
      productos_nombre,
      promociones_id,
      promociones_nombre,
      nombre,
      descripcion,
      is_active
    } = serviceList;

    return {
      id,
      tipo_servicios_id,
      tipo_servicios_nombre,
      productos_id,
      productos_nombre,
      promociones_id,
      promociones_nombre,
      nombre,
      descripcion,
      is_active
    };
  }
  public static casts(dataArray: object[]): ServiceList[]{
    return dataArray.map((data) => ServiceList.cast(data));
  }
}