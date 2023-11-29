import { Address, AddressList } from "./address.model";
import { Contact, ContactList } from "./contact.model";
import { IdentificationDocument } from "./identification-document.model";
import { Model } from "./model";

export class Company extends Model{
  public id?: number;
  public paises_id?: number;
  public codigo_ubigeo?: string;
  public tipo_empresa?: string;
  public razon_social?: string;
  public nombre_comercial?: string;
  public descripcion?: string;
  public is_active?: boolean | number;
  public identifications?: IdentificationDocument[];
  public contacts?: Contact[];
  public addresses?: Address[];

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.paises_id = this.paises_id || null;
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.razon_social = this.razon_social || '';
    this.nombre_comercial = this.nombre_comercial || '';
    this.descripcion = this.descripcion || '';
    this.tipo_empresa = this.tipo_empresa || '';
    this.is_active = this.is_active || 1;
    this.identifications = this.identifications || [];
    this.contacts = this.contacts || [];
    this.addresses = this.addresses || [];
  }

  public static cast(data: object): Company{
    const obj = new Company(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      codigo_ubigeo: obj.codigo_ubigeo,
      razon_social: obj.razon_social,
      nombre_comercial: obj.nombre_comercial,
      descripcion: obj.descripcion,
      tipo_empresa: obj.tipo_empresa,
      is_active: obj.is_active,
      identifications: obj.identifications,
      contacts: obj.contacts,
      addresses: obj.addresses,
    };
  }

  public static casts(dataArray: object[]): Company[]{
    return dataArray.map((data) => Company.cast(data));
  }
}

export class CompanyList extends Model{
  public id?: number;
  public paises_id?: number;
  public codigo_ubigeo?: string;
  public tipo_empresa?: string;
  public razon_social?: string;
  public nombre_comercial?: string;
  public descripcion?: string;
  public is_active?: boolean | number;
  public identifications?: IdentificationDocument[];
  public contacts?: ContactList[];
  public addresses?: AddressList[];

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.paises_id = this.paises_id || null;
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.razon_social = this.razon_social || '';
    this.nombre_comercial = this.nombre_comercial || '';
    this.descripcion = this.descripcion || '';
    this.tipo_empresa = this.tipo_empresa || '';
    this.is_active = this.is_active || 1;
    this.identifications = this.identifications || [];
    this.contacts = this.contacts || [];
    this.addresses = this.addresses || [];
  }

  public static cast(data: object): CompanyList{
    const obj = new CompanyList(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      codigo_ubigeo: obj.codigo_ubigeo,
      razon_social: obj.razon_social,
      nombre_comercial: obj.nombre_comercial,
      descripcion: obj.descripcion,
      tipo_empresa: obj.tipo_empresa,
      is_active: obj.is_active,
      identifications: obj.identifications,
      contacts: obj.contacts,
      addresses: obj.addresses,
    };
  }

  public static casts(dataArray: object[]): CompanyList[]{
    return dataArray.map((data) => CompanyList.cast(data));
  }
}
