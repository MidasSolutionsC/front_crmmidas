import { Model } from "./model";

export class Calendar extends Model{
  public id: number;
  public titulo: string;
  public descripcion: string;
  public color: string;
  public fecha_inicio: string;
  public fecha_final: string;
  public hora_inicio: string;
  public hora_final: string;
  public is_active: boolean;
  public is_seen: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.titulo = this.titulo || '';
    this.descripcion = this.descripcion || '';
    this.color = this.color || '';
    this.fecha_inicio = this.fecha_inicio || '';
    this.fecha_final = this.fecha_final || '';
    this.hora_inicio = this.hora_inicio || '';
    this.hora_final = this.hora_final || '';
    this.is_active = this.is_active || true;
    this.is_seen = this.is_seen || false;
  }

  public static cast(data: object): Calendar{
    const calendar = new Calendar(data);
    const {id, titulo, descripcion, color, fecha_inicio, fecha_final, hora_inicio, hora_final, is_seen, is_active} = calendar;
    return {id, titulo, descripcion, color, fecha_inicio, fecha_final, hora_inicio, hora_final, is_seen, is_active};
  }

  public static casts(dataArray: object[]): Calendar[]{
    return dataArray.map((data) => Calendar.cast(data));
  }
}

export class CalendarList extends Model{
  public id: number;
  public titulo: string;
  public descripcion: string;
  public color: string;
  public fecha_inicio: string;
  public fecha_final: string;
  public hora_inicio: string;
  public hora_final: string;
  public is_active: boolean;
  public is_seen: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.titulo = this.titulo || '';
    this.descripcion = this.descripcion || '';
    this.color = this.color || '';
    this.fecha_inicio = this.fecha_inicio || '';
    this.fecha_final = this.fecha_final || '';
    this.hora_inicio = this.hora_inicio || '';
    this.hora_final = this.hora_final || '';
    this.is_active = this.is_active || true;
    this.is_seen = this.is_seen || false;
  }

  public static cast(data: object): CalendarList{
    const calendarList = new CalendarList(data);
    const {id, titulo, descripcion, color, fecha_inicio, fecha_final, hora_inicio, hora_final, is_seen, is_active} = calendarList;
    return {id, titulo, descripcion, color, fecha_inicio, fecha_final, hora_inicio, hora_final, is_seen, is_active};
  }

  public static casts(dataArray: object[]): CalendarList[]{
    return dataArray.map((data) => CalendarList.cast(data));
  }
}