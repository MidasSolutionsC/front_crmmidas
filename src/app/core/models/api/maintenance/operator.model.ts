import { Model } from "../model";

export class Operator extends Model{
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

  public static cast(data: object): Operator{
    const operator = new Operator(data);
    const {
      id,
      nombre,
      descripcion,
      is_active
    } = operator;

    return {
      id,
      nombre,
      descripcion,
      is_active
    };
  }

  public static casts(dataArray: object[]): Operator[]{
    return dataArray.map((data) => Operator.cast(data));
  }
}

export class OperatorList extends Model{
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

  public static cast(data: object): OperatorList{
    const operatorList = new OperatorList(data);
    const {
      id,
      nombre,
      descripcion,
      is_active
    } = operatorList;

    return {
      id,
      nombre,
      descripcion,
      is_active
    };
  }
  public static casts(dataArray: object[]): OperatorList[]{
    return dataArray.map((data) => OperatorList.cast(data));
  }
}