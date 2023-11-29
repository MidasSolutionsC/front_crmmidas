 import { Address, AddressList } from "./address.model";
import { Contact } from "./contact.model";
import { IdentificationDocument, IdentificationDocumentList } from "./identification-document.model";
import { Model } from "./model";

export class Person extends Model{
  public id?: number;
  public paises_id?: number;
  public codigo_ubigeo?: string;
  public nombres?: string;
  public nacionalidad?: string;
  public apellido_paterno?: string;
  public apellido_materno?: string;
  public fecha_nacimiento?: string;
  public identifications?: IdentificationDocument[];
  public contacts?: Contact[];
  public addresses?: Address[];

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.paises_id = this.paises_id || null;
    this.nombres = this.nombres || null;
    this.nacionalidad = this.nacionalidad || null;
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.fecha_nacimiento = this.fecha_nacimiento || null;
    this.identifications = this.identifications || [];
    this.contacts = this.contacts || [];
    this.addresses = this.addresses || [];
  }

  public static cast(data: object): Person{
    const obj = new Person(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      nombres: obj.nombres,
      nacionalidad: obj.nacionalidad,
      apellido_paterno: obj.apellido_paterno,
      apellido_materno: obj.apellido_materno,
      codigo_ubigeo: obj.codigo_ubigeo,
      fecha_nacimiento: obj.fecha_nacimiento,
      identifications: obj.identifications,
      contacts: obj.contacts,
      addresses: obj.addresses,
    };
  }

  public static casts(dataArray: object[]): Person[]{
    return dataArray.map((data) => Person.cast(data));
  }
}

export class PersonList extends Model{
  public id: number;
  public paises_id: number;
  public paises_nombre: string;
  public nombres: string;
  public nacionalidad?: string;
  public apellido_paterno: string;
  public apellido_materno: string;
  public codigo_ubigeo: string;
  public fecha_nacimiento: string;
  public identifications?: IdentificationDocument[];
  public contacts?: Contact[];
  public addresses?: AddressList[];

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.paises_id = this.paises_id || 0;
    this.paises_nombre = this.paises_nombre || '';
    this.nombres = this.nombres || null;
    this.nacionalidad = this.nacionalidad || null;
    this.apellido_paterno = this.apellido_paterno || '';
    this.apellido_materno = this.apellido_materno || '';
    this.codigo_ubigeo = this.codigo_ubigeo || '';
    this.fecha_nacimiento = this.fecha_nacimiento || '';
    this.identifications = this.identifications || [];
    this.contacts = this.contacts || [];
    this.addresses = this.addresses || [];
  }

  public static cast(data: object): PersonList{
    const obj = new PersonList(data);
    return {
      id: obj.id, 
      paises_id: obj.paises_id,
      paises_nombre: obj.paises_nombre,
      nombres: obj.nombres,
      nacionalidad: obj.nacionalidad,
      apellido_paterno: obj.apellido_paterno,
      apellido_materno: obj.apellido_materno,
      codigo_ubigeo: obj.codigo_ubigeo,
      fecha_nacimiento: obj.fecha_nacimiento,
      identifications: obj.identifications,
      contacts: obj.contacts,
      addresses: obj.addresses,
    };
  }

  public static casts(dataArray: object[]): PersonList[]{
    return dataArray.map((data) => PersonList.cast(data));
  }
}