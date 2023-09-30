import { Model } from "./model";

export class SaleDetail extends Model{
  public id: number;
  public ventas_id: number;
  public servicios_id: number;
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
    this.servicios_id = this.servicios_id || null;
    this.instalaciones_id = this.instalaciones_id || null;
    this.tipo_estados_id = this.tipo_estados_id || null;
    this.observacion = this.observacion || null;
    this.fecha_cierre = this.fecha_cierre || null;
    this.datos_json = this.datos_json || null;
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): SaleDetail{
    const saleDetail = new SaleDetail(data);
    const {
      id, 
      ventas_id,
      servicios_id,
      instalaciones_id,
      tipo_estados_id,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    } = saleDetail;

    return {
      id, 
      ventas_id,
      servicios_id,
      instalaciones_id,
      tipo_estados_id,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    }
  }

  public static casts(dataArray: object[]): SaleDetail[]{
    return dataArray.map((data) =>SaleDetail.cast(data));
  }
}

export class SaleDetailList extends Model{
  public id: number;
  public ventas_id: number;
  public tipo_servicios_id: number;
  public tipo_servicios_nombre: string;
  public servicios_id: number;
  public servicios_nombre: string;
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


  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.ventas_id = this.ventas_id || 0;
    this.tipo_servicios_id = this.tipo_servicios_id || 0;
    this.tipo_servicios_nombre = this.tipo_servicios_nombre || '';
    this.servicios_id = this.servicios_id || 0;
    this.servicios_nombre = this.servicios_nombre || '';
    this.instalaciones_id = this.instalaciones_id || 0;
    this.instalaciones_direccion_completo = this.instalaciones_direccion_completo || '';
    this.instalaciones_provincia = this.instalaciones_provincia || '';
    this.instalaciones_localidad = this.instalaciones_localidad || '';
    this.instalaciones_codigo_postal = this.instalaciones_codigo_postal || '';
    this.tipo_estados_id = this.tipo_estados_id || null;
    this.tipo_estados_nombre = this.tipo_estados_nombre || '';
    this.observacion = this.observacion || '';
    this.fecha_cierre = this.fecha_cierre || '';
    this.datos_json = this.datos_json || {};
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): SaleDetailList{
    const saleDetailList = new SaleDetailList(data);
    const {
      id, 
      ventas_id,
      tipo_servicios_id,
      tipo_servicios_nombre,
      servicios_id,
      servicios_nombre,
      instalaciones_id,
      instalaciones_direccion_completo,
      instalaciones_provincia,
      instalaciones_localidad,
      instalaciones_codigo_postal,
      tipo_estados_id,
      tipo_estados_nombre,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    }= saleDetailList;
    
    return {
      id, 
      ventas_id,
      tipo_servicios_id,
      tipo_servicios_nombre,
      servicios_id,
      servicios_nombre,
      instalaciones_id,
      instalaciones_direccion_completo,
      instalaciones_provincia,
      instalaciones_localidad,
      instalaciones_codigo_postal,
      tipo_estados_id,
      tipo_estados_nombre,
      observacion,
      fecha_cierre,
      datos_json,
      is_active
    };
  }
  public static casts(dataArray: object[]): SaleDetailList[]{
    return dataArray.map((data) => SaleDetailList.cast(data));
  }
}

export class DetailMobileLine extends Model{
  public tipo_documento_id: number;
  public documento_titular: string;
  public titular: string;
  public operador_donante_id: number;
  public num_portar: string;
  public icc: string;
  public terminal: boolean;
  public modelo_terminal: string;
  public aop: string;


  constructor(data?: object){
    super(data);
    this.tipo_documento_id = this.tipo_documento_id || 0;
    this.documento_titular = this.documento_titular || null;
    this.titular = this.titular || null;
    this.operador_donante_id = this.operador_donante_id || 0;
    this.num_portar = this.num_portar || null;
    this.icc = this.icc || null;
    this.terminal = this.terminal || false;
    this.modelo_terminal = this.modelo_terminal || null;
    this.aop = this.aop || null;
  }

  public static cast(data: object): DetailMobileLine{
    const detailMobileList = new DetailMobileLine(data);
    const {
      tipo_documento_id,
      documento_titular,
      titular,
      operador_donante_id,
      num_portar,
      icc,
      terminal,
      modelo_terminal,
      aop
    }= detailMobileList;
    
    return {
      tipo_documento_id,
      documento_titular,
      titular,
      operador_donante_id,
      num_portar,
      icc,
      terminal,
      modelo_terminal,
      aop
    };
  }
  public static casts(dataArray: object[]): DetailMobileLine[]{
    return dataArray.map((data) => DetailMobileLine.cast(data));
  }
}

export class DetailMobileLineList extends Model{
  public tipo_documento_id: number;
  public tipo_documento_nombre: string;
  public tipo_documento_abreviacion: string;
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
    this.tipo_documento_id = this.tipo_documento_id || 0;
    this.tipo_documento_nombre = this.tipo_documento_nombre || null;
    this.tipo_documento_abreviacion = this.tipo_documento_abreviacion || null;
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
      tipo_documento_id,
      tipo_documento_nombre,
      tipo_documento_abreviacion,
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
      tipo_documento_id,
      tipo_documento_nombre,
      tipo_documento_abreviacion,
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
  public tipo_documento_id: number;
  public documento_titular: string;
  public titular: string;
  public operador_donante_id: number;
  public num_portar: string;
  public aop: string;


  constructor(data?: object){
    super(data);
    this.tipo_documento_id = this.tipo_documento_id || 0;
    this.documento_titular = this.documento_titular || null;
    this.titular = this.titular || null;
    this.operador_donante_id = this.operador_donante_id || 0;
    this.num_portar = this.num_portar || null;
    this.aop = this.aop || null;
  }

  public static cast(data: object): DetailFixedLine{
    const detailFixedList = new DetailFixedLine(data);
    const {
      tipo_documento_id,
      documento_titular,
      titular,
      operador_donante_id,
      num_portar,
      aop
    }= detailFixedList;
    
    return {
      tipo_documento_id,
      documento_titular,
      titular,
      operador_donante_id,
      num_portar,
      aop
    };
  }
  public static casts(dataArray: object[]): DetailFixedLine[]{
    return dataArray.map((data) => DetailFixedLine.cast(data));
  }
}

export class DetailFixedLineList extends Model{
  public tipo_documento_id: number;
  public tipo_documento_nombre: string;
  public tipo_documento_abreviacion: string;
  public documento_titular: string;
  public titular: string;
  public operador_donante_id: number;
  public operador_donante_nombre: string;
  public num_portar: string;
  public aop: string;


  constructor(data?: object){
    super(data);
    this.tipo_documento_id = this.tipo_documento_id || 0;
    this.tipo_documento_nombre = this.tipo_documento_nombre || null;
    this.tipo_documento_abreviacion = this.tipo_documento_abreviacion || null;
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
      tipo_documento_id,
      tipo_documento_nombre,
      tipo_documento_abreviacion,
      documento_titular,
      titular,
      operador_donante_id,
      operador_donante_nombre,
      num_portar,
      aop
    }= detailFixedList;
    
    return {
      tipo_documento_id,
      tipo_documento_nombre,
      tipo_documento_abreviacion,
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

