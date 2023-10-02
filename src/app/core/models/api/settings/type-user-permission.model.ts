import { Model } from "../model";

export class TypeUserPermission extends Model{
  public id: number;
  public permisos_id: number;
  public tipo_usuarios_id: number;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.permisos_id = this.permisos_id || 0;
    this.tipo_usuarios_id = this.tipo_usuarios_id || 0;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): TypeUserPermission{
    const typeUserPermission = new TypeUserPermission(data);
    const {id, permisos_id, tipo_usuarios_id, is_active} = typeUserPermission;
    return {id, permisos_id, tipo_usuarios_id, is_active};
  }

  public static casts(dataArray: object[]): TypeUserPermission[]{
    return dataArray.map((data) => TypeUserPermission.cast(data));
  }
}

export class TypeUserPermissionList extends Model{
  public id: number;
  public permisos_id: number;
  public tipo_usuarios_id: number;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.permisos_id = this.permisos_id || 0;
    this.tipo_usuarios_id = this.tipo_usuarios_id || 0;
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): TypeUserPermissionList{
    const typeUserPermissionList = new TypeUserPermissionList(data);
    const { id, permisos_id, tipo_usuarios_id, is_active, created_at, updated_at, deleted_at } = typeUserPermissionList;
    return {id, permisos_id, tipo_usuarios_id, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): TypeUserPermissionList[]{
    return dataArray.map((data) => TypeUserPermissionList.cast(data));
  }
}
