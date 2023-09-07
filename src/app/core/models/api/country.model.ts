import { Model } from "./model";

export class Country extends Model{
  public id: number;
  public iso_code: string;
  public nombre: string;
  // public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.iso_code = this.iso_code || '';
    this.nombre = this.nombre || '';
  }

  public static cast(data: object): Country{
    const country = new Country(data);
    const {id, nombre, iso_code} = country;
    return {id, nombre, iso_code};
  }

  public static casts(dataArray: object[]): Country[]{
    return dataArray.map((data) => Country.cast(data));
  }
}

export class CountryList extends Model{
  public id: number;
  public iso_code: string;
  public nombre: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.iso_code = this.iso_code || '';
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): CountryList{
    const countryList = new CountryList(data);
    const { id, nombre, iso_code, created_at, updated_at, deleted_at } = countryList;
    return {id, nombre, iso_code, created_at, updated_at, deleted_at};
  }

  public static casts(dataArray: object[]): CountryList[]{
    return dataArray.map((data) => CountryList.cast(data));
  }
}