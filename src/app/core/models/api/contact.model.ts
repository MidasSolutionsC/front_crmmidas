import { Model } from "./model";

export class Contact extends Model{
  public id?: number;
  public empresas_id?: number;
  public personas_id?: number;
  public tipo?: string;
  public contacto?: string;
  public is_primary?: boolean | number;
  public is_active?: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.empresas_id = this.empresas_id || null;
    this.personas_id = this.personas_id || null;
    this.tipo = this.tipo || null;
    this.contacto = this.contacto || null;
    this.is_primary = this.is_primary || 0;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): Contact{
    const obj = new Contact(data);
    return {
      id: obj.id, 
      empresas_id: obj.empresas_id,
      personas_id: obj.personas_id,
      tipo: obj.tipo,
      contacto: obj.contacto,
      is_primary: obj.is_primary,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): Contact[]{
    return dataArray.map((data) => Contact.cast(data));
  }
}

export class ContactList extends Model{
  public id: number;
  public empresas_id: number;
  public personas_id: number;
  public tipo: string;
  public tipo_text: string;
  public contacto: string;
  public is_primary: boolean | number;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.empresas_id = this.empresas_id || null;
    this.personas_id = this.personas_id || null;
    this.tipo = this.tipo || null;
    this.tipo_text = this.tipo_text || null;
    this.contacto = this.contacto || null;
    this.is_primary = this.is_primary || 0;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): ContactList{
    const obj = new ContactList(data);
    return {
      id: obj.id, 
      empresas_id: obj.empresas_id,
      personas_id: obj.personas_id,
      tipo: obj.tipo,
      tipo_text: obj.tipo_text,
      contacto: obj.contacto,
      is_primary: obj.is_primary,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): ContactList[]{
    return dataArray.map((data) => ContactList.cast(data));
  }
}
