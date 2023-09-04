import { Model } from "../model";

export class Ubigeo extends Model{
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

  public static cast(data: object): Ubigeo{
    const typeUser = new Ubigeo(data);
    const {id, nombre, descripcion, is_active} = typeUser;
    return {id, nombre, descripcion, is_active};
  }
  
  public static cats(dataArray: object[]): Ubigeo[]{
    return dataArray.map((data) => Ubigeo.cast(data));
  }
}

export class UbigeoList extends Model{
  public ubigeo: string;
  public dpto: string;
  public prov: string;
  public distrito: string;
  public ubigeo2: string;
  public orden: string;
  public ciudad: string;

  constructor(data?: object){
    super(data);
    this.ubigeo = this.ubigeo || '';
    this.dpto = this.dpto || '';
    this.prov = this.prov || '';
    this.distrito = this.distrito || '';
    this.ubigeo2 = this.ubigeo2 || '';
    this.orden = this.orden || '';
    this.ciudad = this.ciudad || '';
  }

  public static cast(data: object): UbigeoList{
    const ubigeoList = new UbigeoList(data);
    const { ubigeo, dpto, prov, distrito, ubigeo2, orden, ciudad  } = ubigeoList;
    return {ubigeo, dpto, prov, distrito, ubigeo2, orden, ciudad };
  }

  public static cats(dataArray: object[]): UbigeoList[]{
    return dataArray.map((data) => UbigeoList.cast(data));
  }
}