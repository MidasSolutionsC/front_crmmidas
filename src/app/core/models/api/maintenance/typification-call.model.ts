import { Model } from "../model";

export class TypificationCall extends Model{
  public id: number;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): TypificationCall{
    const typificationCall = new TypificationCall(data);
    const {
      id,
      nombre,
      descripcion,
      is_active
    } = typificationCall;

    return {
      id,
      nombre,
      descripcion,
      is_active
    };
  }

  public static casts(dataArray: object[]): TypificationCall[]{
    return dataArray.map((data) => TypificationCall.cast(data));
  }
}

export class TypificationCallList extends Model{
  public id: number;
  public nombre: string;
  public descripcion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): TypificationCallList{
    const typificationCallList = new TypificationCallList(data);
    const {
      id,
      nombre,
      descripcion,
      is_active
    } = typificationCallList;

    return {
      id,
      nombre,
      descripcion,
      is_active
    };
  }
  public static casts(dataArray: object[]): TypificationCallList[]{
    return dataArray.map((data) => TypificationCallList.cast(data));
  }
}