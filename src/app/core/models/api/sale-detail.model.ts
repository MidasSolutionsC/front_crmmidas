import { ProductList, PromotionList } from "./maintenance";
import { Model } from "./model";

export class SaleDetail extends Model{
  public id: number;
  public ventas_id: number;
  public productos_id: number;
  public promociones_id: number;
  public cantidad: number;
  public instalaciones_id: number;
  public tipo_estados_id: number;
  public observacion: string;
  public fecha_cierre: string;
  public datos_json: object;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.ventas_id = this.ventas_id || null;
    this.productos_id = this.productos_id || null;
    this.promociones_id = this.promociones_id || null;
    this.cantidad = this.cantidad || null;
    this.instalaciones_id = this.instalaciones_id || null;
    this.tipo_estados_id = this.tipo_estados_id || null;
    this.observacion = this.observacion || null;
    this.fecha_cierre = this.fecha_cierre || null;
    this.datos_json = this.datos_json || null;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): SaleDetail{
    const saleDetail = new SaleDetail(data);
    return {
      id: saleDetail.id, 
      ventas_id: saleDetail.ventas_id,
      productos_id: saleDetail.productos_id,
      promociones_id: saleDetail.promociones_id,
      cantidad: saleDetail.cantidad,
      instalaciones_id: saleDetail.instalaciones_id,
      tipo_estados_id: saleDetail.tipo_estados_id,
      observacion: saleDetail.observacion,
      fecha_cierre: saleDetail.fecha_cierre,
      datos_json: saleDetail.datos_json,
      is_active: saleDetail.is_active
    }
  }

  public static casts(dataArray: object[]): SaleDetail[]{
    return dataArray.map((data) =>SaleDetail.cast(data));
  }
}

export class SaleDetailList extends Model{
  public id: number;
  public ventas_id: number;
  public productos_id: number;
  public promociones_id: number;
  public cantidad: number;
  public instalaciones_id: number;
  public instalaciones_direccion_completo: string;
  public instalaciones_provincia: string;
  public instalaciones_localidad: string;
  public instalaciones_codigo_postal: string;
  public tipo_estados_id: number;
  public tipo_estados_nombre: string;
  public observacion: string;
  public fecha_cierre: string;
  public datos_json: any;
  public is_active: boolean;
  public product?: ProductList;
  public promotion?: PromotionList;


  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.ventas_id = this.ventas_id || 0;
    this.productos_id = this.productos_id || null;
    this.promociones_id = this.promociones_id || null;
    this.cantidad = this.cantidad || null;
    this.instalaciones_id = this.instalaciones_id || 0;
    this.instalaciones_direccion_completo = this.instalaciones_direccion_completo || '';
    this.instalaciones_provincia = this.instalaciones_provincia || '';
    this.instalaciones_localidad = this.instalaciones_localidad || '';
    this.instalaciones_codigo_postal = this.instalaciones_codigo_postal || '';
    this.tipo_estados_id = this.tipo_estados_id || null;
    this.tipo_estados_nombre = this.tipo_estados_nombre || '';
    this.observacion = this.observacion || '';
    this.fecha_cierre = this.fecha_cierre || '';
    this.datos_json = this.datos_json || null;
    this.product = this.product || null;
    this.promotion = this.promotion || null;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): SaleDetailList{
    const saleDetailList = new SaleDetailList(data);
    return {
      id: saleDetailList.id,
      ventas_id: saleDetailList.ventas_id,
      productos_id: saleDetailList.productos_id,
      promociones_id: saleDetailList.promociones_id,
      cantidad: saleDetailList.cantidad,
      instalaciones_id: saleDetailList.instalaciones_id,
      instalaciones_direccion_completo: saleDetailList.instalaciones_direccion_completo,
      instalaciones_provincia: saleDetailList.instalaciones_provincia,
      instalaciones_localidad: saleDetailList.instalaciones_localidad,
      instalaciones_codigo_postal: saleDetailList.instalaciones_codigo_postal,
      tipo_estados_id: saleDetailList.tipo_estados_id,
      tipo_estados_nombre: saleDetailList.tipo_estados_nombre,
      observacion: saleDetailList.observacion,
      fecha_cierre: saleDetailList.fecha_cierre,
      datos_json: saleDetailList.datos_json,
      product: saleDetailList.product,
      promotion: saleDetailList.promotion,
      is_active: saleDetailList.is_active,
    }
  }
  public static casts(dataArray: object[]): SaleDetailList[]{
    return dataArray.map((data) => SaleDetailList.cast(data));
  }
}

export class DetailMobileLine extends Model{
  public tipo_documentos_id?: number;
  public documento_titular?: string;
  public titular?: string;
  public operador_donante_id?: number;
  public num_portar?: string;
  public icc?: string;
  public terminal?: boolean;
  public modelo_terminal?: string;
  public aop?: string;
  public es_linea_principal?: boolean;
  public es_contrato?: boolean;


  constructor(data?: object){
    super(data);
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.documento_titular = this.documento_titular || null;
    this.titular = this.titular || null;
    this.operador_donante_id = this.operador_donante_id || 0;
    this.num_portar = this.num_portar || null;
    this.icc = this.icc || null;
    this.terminal = this.terminal || false;
    this.modelo_terminal = this.modelo_terminal || null;
    this.aop = this.aop || null;
    this.es_linea_principal = this.es_linea_principal || false;
    this.es_contrato = this.es_contrato || false;
  }

  public static cast(data: object): DetailMobileLine{
    const detailMobileList = new DetailMobileLine(data);
   return {
    tipo_documentos_id: detailMobileList.tipo_documentos_id,
    documento_titular: detailMobileList.documento_titular,
    titular: detailMobileList.titular,
    operador_donante_id: detailMobileList.operador_donante_id,
    num_portar: detailMobileList.num_portar,
    icc: detailMobileList.icc,
    terminal: detailMobileList.terminal,
    modelo_terminal: detailMobileList.modelo_terminal,
    aop: detailMobileList.aop,
    es_linea_principal: detailMobileList.es_linea_principal,
    es_contrato: detailMobileList.es_contrato,
   }
  }
  public static casts(dataArray: object[]): DetailMobileLine[]{
    return dataArray.map((data) => DetailMobileLine.cast(data));
  }
}

export class DetailMobileLineList extends Model{
  public tipo_documentos_id: number;
  public tipo_documentos_nombre: string;
  public tipo_documentos_abreviacion: string;
  public documento_titular: string;
  public titular: string;
  public operador_donante_id: number;
  public operador_donante_nombre: string;
  public num_portar: string;
  public icc: string;
  public terminal: boolean;
  public modelo_terminal: string;
  public aop: string;


  constructor(data?: object){
    super(data);
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.tipo_documentos_nombre = this.tipo_documentos_nombre || null;
    this.tipo_documentos_abreviacion = this.tipo_documentos_abreviacion || null;
    this.documento_titular = this.documento_titular || null;
    this.titular = this.titular || null;
    this.operador_donante_id = this.operador_donante_id || 0;
    this.operador_donante_nombre = this.operador_donante_nombre || null;
    this.num_portar = this.num_portar || null;
    this.icc = this.icc || null;
    this.terminal = this.terminal || false;
    this.modelo_terminal = this.modelo_terminal || null;
    this.aop = this.aop || null;
  }

  public static cast(data: object): DetailMobileLineList{
    const detailMobileList = new DetailMobileLineList(data);
    const {
      tipo_documentos_id,
      tipo_documentos_nombre,
      tipo_documentos_abreviacion,
      documento_titular,
      titular,
      operador_donante_id,
      operador_donante_nombre,
      num_portar,
      icc,
      terminal,
      modelo_terminal,
      aop
    }= detailMobileList;
    
    return {
      tipo_documentos_id,
      tipo_documentos_nombre,
      tipo_documentos_abreviacion,
      documento_titular,
      titular,
      operador_donante_id,
      operador_donante_nombre,
      num_portar,
      icc,
      terminal,
      modelo_terminal,
      aop
    };
  }
  public static casts(dataArray: object[]): DetailMobileLineList[]{
    return dataArray.map((data) => DetailMobileLineList.cast(data));
  }
}

export class DetailFixedLine extends Model{
  public tipo_documentos_id: number;
  public documento_titular: string;
  public titular: string;
  public operador_donante_id: number;
  public num_portar: string;
  public aop: string;


  constructor(data?: object){
    super(data);
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.documento_titular = this.documento_titular || null;
    this.titular = this.titular || null;
    this.operador_donante_id = this.operador_donante_id || 0;
    this.num_portar = this.num_portar || null;
    this.aop = this.aop || null;
  }

  public static cast(data: object): DetailFixedLine{
    const detailFixedList = new DetailFixedLine(data);
    return {
      tipo_documentos_id: detailFixedList.tipo_documentos_id,
      documento_titular: detailFixedList.documento_titular,
      titular: detailFixedList.titular,
      operador_donante_id: detailFixedList.operador_donante_id,
      num_portar: detailFixedList.num_portar,
      aop: detailFixedList.aop,
     }
  }
  public static casts(dataArray: object[]): DetailFixedLine[]{
    return dataArray.map((data) => DetailFixedLine.cast(data));
  }
}

export class DetailFixedLineList extends Model{
  public tipo_documentos_id: number;
  public tipo_documentos_nombre: string;
  public tipo_documentos_abreviacion: string;
  public documento_titular: string;
  public titular: string;
  public operador_donante_id: number;
  public operador_donante_nombre: string;
  public num_portar: string;
  public aop: string;


  constructor(data?: object){
    super(data);
    this.tipo_documentos_id = this.tipo_documentos_id || 0;
    this.tipo_documentos_nombre = this.tipo_documentos_nombre || null;
    this.tipo_documentos_abreviacion = this.tipo_documentos_abreviacion || null;
    this.documento_titular = this.documento_titular || null;
    this.titular = this.titular || null;
    this.operador_donante_id = this.operador_donante_id || 0;
    this.operador_donante_nombre = this.operador_donante_nombre || null;
    this.num_portar = this.num_portar || null;
    this.aop = this.aop || null;
  }

  public static cast(data: object): DetailFixedLineList{
    const detailFixedList = new DetailFixedLineList(data);
    const {
      tipo_documentos_id,
      tipo_documentos_nombre,
      tipo_documentos_abreviacion,
      documento_titular,
      titular,
      operador_donante_id,
      operador_donante_nombre,
      num_portar,
      aop
    }= detailFixedList;
    
    return {
      tipo_documentos_id,
      tipo_documentos_nombre,
      tipo_documentos_abreviacion,
      documento_titular,
      titular,
      operador_donante_id,
      operador_donante_nombre,
      num_portar,
      aop
    };
  }
  public static casts(dataArray: object[]): DetailFixedLineList[]{
    return dataArray.map((data) => DetailFixedLineList.cast(data));
  }
}

export class DetailTvLine extends Model{
  public deco: boolean;


  constructor(data?: object){
    super(data);
    this.deco = this.deco || false
  }

  public static cast(data: object): DetailTvLine{
    const obj = new DetailTvLine(data);
    return {
      deco: obj.deco,
     }
  }
  public static casts(dataArray: object[]): DetailTvLine[]{
    return dataArray.map((data) => DetailTvLine.cast(data));
  }
}