import { Model } from "../model";

export class TypeDocument extends Model{
  public id: number;
  public nombre: string;
  public abreviacion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.nombre = this.nombre || '';
    this.abreviacion = this.abreviacion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): TypeDocument{
    const typeDocument = new TypeDocument(data);
    const {id, nombre, abreviacion, is_active} = typeDocument;
    return {id, nombre, abreviacion, is_active};
  }

  public static cats(dataArray: object[]): TypeDocument[]{
    return dataArray.map((data) => TypeDocument.cast(data));
  }
}

export class TypeDocumentList extends Model{
  public id: number;
  public nombre: string;
  public abreviacion: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.abreviacion = this.abreviacion || '';
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): TypeDocumentList{
    const typeDocumentList = new TypeDocumentList(data);
    const { id, nombre, abreviacion, is_active, created_at, updated_at, deleted_at } = typeDocumentList;
    return {id, nombre, abreviacion, is_active, created_at, updated_at, deleted_at};
  }

  public static cats(dataArray: object[]): TypeDocumentList[]{
    return dataArray.map((data) => TypeDocumentList.cast(data));
  }
}