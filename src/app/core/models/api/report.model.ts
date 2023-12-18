import { Model } from "./model";

export class Report extends Model {
  public fecha_inicio?: Date;
  public fecha_fin?: Date;

  constructor(data?: object) {
    super(data);
    this.fecha_inicio = this.fecha_inicio;
    this.fecha_fin = this.fecha_fin;
  }

  public static cast(data: object): Report {
    const obj = new Report(data);
    return {
      fecha_fin: obj.fecha_fin,
      fecha_inicio: obj.fecha_inicio,
    };
  }

  public static casts(dataArray: object[]): Report[] {
    return dataArray.map((data) => Report.cast(data));
  }
}


