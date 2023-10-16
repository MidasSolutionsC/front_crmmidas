import { Model } from "./model";

export class IdentificationDocument extends Model{
  public id?: number;
  public personas_id?: number;
  public empresas_id?: number;
  public tipo_documentos_id?: number;
  public documento?: string;
  public reverso_documento?: string;
  public show_reverse?: boolean;
  public is_primary?: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.personas_id = this.personas_id || null;
    this.empresas_id = this.empresas_id || null;
    this.tipo_documentos_id = this.tipo_documentos_id || null;
    this.documento = this.documento || null;
    this.reverso_documento = this.reverso_documento || null;
    this.is_primary = this.is_primary || 0;
    this.show_reverse = this.show_reverse || false;
  }

  public static cast(data: object): IdentificationDocument{
    const obj = new IdentificationDocument(data);
    return {
      id: obj.id, 
      personas_id: obj.personas_id,
      empresas_id: obj.empresas_id,
      tipo_documentos_id: obj.tipo_documentos_id,
      documento: obj.documento,
      reverso_documento: obj.reverso_documento,
      is_primary: obj.is_primary,
      show_reverse: obj.show_reverse,
    };
  }

  public static casts(dataArray: object[]): IdentificationDocument[]{
    return dataArray.map((data) => IdentificationDocument.cast(data));
  }
}

export class IdentificationDocumentList extends Model{
  public id?: number;
  public personas_id?: number;
  public empresas_id?: number;
  public tipo_documentos_id: number;
  public tipo_documentos_nombre?: number;
  public tipo_documentos_abreviacion?: number;
  public documento?: string;
  public reverso_documento?: string;
  public is_primary?: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.personas_id = this.personas_id || null;
    this.empresas_id = this.empresas_id || null;
    this.tipo_documentos_id = this.tipo_documentos_id || null;
    this.tipo_documentos_nombre = this.tipo_documentos_nombre || null;
    this.tipo_documentos_abreviacion = this.tipo_documentos_abreviacion || null;
    this.documento = this.documento || null;
    this.reverso_documento = this.reverso_documento || null;
    this.is_primary = this.is_primary || 0;
  }

  public static cast(data: object): IdentificationDocumentList{
    const obj = new IdentificationDocumentList(data);
    return {
      id: obj.id, 
      personas_id: obj.personas_id,
      empresas_id: obj.empresas_id,
      tipo_documentos_id: obj.tipo_documentos_id,
      tipo_documentos_nombre: obj.tipo_documentos_nombre,
      tipo_documentos_abreviacion: obj.tipo_documentos_abreviacion,
      documento: obj.documento,
      reverso_documento: obj.reverso_documento,
      is_primary: obj.is_primary,
    };
  }

  public static casts(dataArray: object[]): IdentificationDocumentList[]{
    return dataArray.map((data) => IdentificationDocumentList.cast(data));
  }
}
