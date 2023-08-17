import { Model } from "./model";

export class ResponseApi extends Model{
  public code: number;
  public status: string;
  public message: string;
  public data: any;
  public errors: any;

  constructor(data?: object){
    super(data);
    this.code = this.code || 0;
    this.status = this.status || '';
    this.message = this.message || '';
    this.data = this.data || '';
    this.errors = this.errors || '';
  }

  public static cast(data: object): ResponseApi{
    return new ResponseApi(data);
  }

}