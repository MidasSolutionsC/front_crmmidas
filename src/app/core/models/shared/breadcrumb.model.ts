import { Model } from "../api/model";

export class Breadcrumb extends Model{
  public label: string;
  public link: string;
  public active: boolean;

  constructor(data?: object){
    super(data);
    this.label = this.label || '';
    this.link = this.link || '';
    this.active = this.active || false;
  }

  public static cast(data: object): Breadcrumb{
    return new Breadcrumb(data);
  }

  public static casts(dataArray: object[]): Breadcrumb[]{
    return dataArray.map((data) => new Breadcrumb(data));
  }
}