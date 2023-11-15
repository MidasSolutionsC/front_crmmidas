import { Model } from "../model";

export class TypeService extends Model{
  public id: number;
  public nombre: string;
  public icono?: string;
  public descripcion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.nombre = this.nombre || null;
    this.icono = this.icono || null;
    this.descripcion = this.descripcion || null;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): TypeService{
    const typeUser = new TypeService(data);
    const {id, nombre,icono, descripcion, is_active} = typeUser;
    return {id, nombre,icono, descripcion, is_active};
  }

  public static casts(dataArray: object[]): TypeService[]{
    return dataArray.map((data) => TypeService.cast(data));
  }
}

export class TypeServiceList extends Model{
  public id: number;
  public nombre: string;
  public icono?: string;
  public descripcion: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.icono = this.icono || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): TypeServiceList{
    const typeUserList = new TypeServiceList(data);
    const { id, nombre, icono, descripcion, is_active, created_at, updated_at, deleted_at } = typeUserList;
    return {id, nombre, icono, descripcion, is_active, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): TypeServiceList[]{
    return dataArray.map((data) => TypeServiceList.cast(data));
  }
}