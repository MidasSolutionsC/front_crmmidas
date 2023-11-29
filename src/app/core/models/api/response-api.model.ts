import { Model } from "./model";
import { PaginationResult } from "./pagination.model";

export class ResponseApi extends Model{
  public code: number;
  public status: string;
  public message: string;
  public data: any;
  public errors: any;

  constructor(data?: object){
    super(data);
    this.code = this.code || 200;
    this.status = this.status || '';
    this.message = this.message || '';
    this.data = this.data || '';
    this.errors = this.errors || '';
  }

  public static cast(data: object): ResponseApi{
    return new ResponseApi(data);
  }

}


export class ResponsePagination extends Model{
  public code: number;
  public status: string;
  public message: string;
  public data: PaginationResult | null;
  public errors: any;

  constructor(data?: object){
    super(data);
    this.code = this.code || 200;
    this.status = this.status || '';
    this.message = this.message || '';
    this.data = this.data || null;
    this.errors = this.errors || '';
  }

  public static cast(data: object): ResponseApi{
    return new ResponseApi(data);
  }

}