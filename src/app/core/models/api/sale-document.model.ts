import { Model } from "./model";

export class SaleDocument extends Model{
  public id: number;
  public ventas_id: number;
  public ventas_detalles_id: number;
  public tipo_documentos_id: number;
  public tipo: string;
  public nombre: string;
  public archivo: string;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.ventas_detalles_id = this.ventas_detalles_id || null;
    this.tipo_documentos_id = this.tipo_documentos_id || null;
    this.nombre = this.nombre || null;
    this.tipo = this.tipo || null;
    this.archivo = this.archivo || null;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): SaleDocument{
    const obj = new SaleDocument(data);
    return {
      id: obj.id,
      ventas_id: obj.ventas_id,
      ventas_detalles_id: obj.ventas_detalles_id,
      tipo_documentos_id: obj.tipo_documentos_id,
      nombre: obj.nombre,
      tipo: obj.tipo,
      archivo: obj.archivo,
      is_active: obj.is_active
    }
  }

  public static casts(dataArray: object[]): SaleDocument[]{
    return dataArray.map((data) =>SaleDocument.cast(data));
  }
}

export class SaleDocumentList extends Model{
  public id: number;
  public ventas_id: number;
  public ventas_detalles_id: number;
  public tipo_documentos_id: number;
  public tipo: string;
  public nombre: string;
  public archivo: string;
  public is_active: boolean | number;
  public type_document?: object;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.ventas_detalles_id = this.ventas_detalles_id || null;
    this.tipo_documentos_id = this.tipo_documentos_id || null;
    this.nombre = this.nombre || null;
    this.tipo = this.tipo || null;
    this.archivo = this.archivo || null;
    this.is_active = this.is_active || 1;
    this.type_document = this.type_document || Object;
  }

  public static cast(data: object): SaleDocumentList{
    const obj = new SaleDocumentList(data);
    return {
      id: obj.id,
      ventas_id: obj.ventas_id,
      ventas_detalles_id: obj.ventas_detalles_id,
      tipo_documentos_id: obj.tipo_documentos_id,
      nombre: obj.nombre,
      tipo: obj.tipo,
      archivo: obj.archivo,
      is_active: obj.is_active,
      type_document: obj.type_document,
    }
  }

  public static casts(dataArray: object[]): SaleDocumentList[]{
    return dataArray.map((data) => SaleDocumentList.cast(data));
  }
}

