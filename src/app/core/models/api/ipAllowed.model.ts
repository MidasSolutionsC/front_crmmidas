import { Model } from "./model";

export class IpAllowed extends Model {
  public id: number;
  public ip: string;
  public descripcion: string;
  // public is_active: boolean;

  constructor(data?: object) {
    super(data);
    this.id = this.id || 0;
    this.ip = this.ip || '';
    this.descripcion = this.descripcion || '';
  }

  public static cast(data: object): IpAllowed {
    const ipAllowed = new IpAllowed(data);
    const { id, descripcion, ip } = ipAllowed;
    return { id, descripcion, ip };
  }

  public static casts(dataArray: object[]): IpAllowed[] {
    return dataArray.map((data) => IpAllowed.cast(data));
  }
}

export class IpAllowedList extends Model {
  public id: number;
  public ip: string;
  public descripcion: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object) {
    super(data);
    this.id = this.id || 0;
    this.descripcion = this.descripcion || '';
    this.ip = this.ip || '';
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): IpAllowedList {
    const ipAllowedList = new IpAllowedList(data);
    const { id, descripcion, ip, created_at, updated_at, deleted_at } = ipAllowedList;
    return { id, descripcion, ip, created_at, updated_at, deleted_at };
  }

  public static casts(dataArray: object[]): IpAllowedList[] {
    return dataArray.map((data) => IpAllowedList.cast(data));
  }
}