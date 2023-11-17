import { Model } from "../model";

export class Permission extends Model{
  public id: number;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): Permission{
    const permission = new Permission(data);
    const {id, nombre, descripcion, is_active} = permission;
    return {id, nombre, descripcion, is_active};
  }

  public static casts(dataArray: object[]): Permission[]{
    return dataArray.map((data) => Permission.cast(data));
  }
}

export class PermissionList extends Model{
  public id: number;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): PermissionList{
    const permissionList = new PermissionList(data);
    const { id, nombre, descripcion, is_active, created_at, updated_at, deleted_at } = permissionList;
    return {id, nombre, descripcion, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): PermissionList[]{
    return dataArray.map((data) => PermissionList.cast(data));
  }
}
