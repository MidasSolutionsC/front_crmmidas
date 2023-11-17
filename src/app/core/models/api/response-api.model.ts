import { Model } from "./model";

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

export class Link extends Model{
  public url: string;
  public label: string;
  public active: boolean;

  constructor(data?: object){
    super(data);
    this.url = this.url || '';
    this.label = this.label || '';
    this.active = this.active || false;
  }

  public static cast(data: object): Link{
    const {url, label, active} = new Link(data);
    return {url, label, active};
  }

}

export class Pagination extends Model{
  public current_page: number;
  public data: any;
  public first_page_url: string;
  public from: number;
  public last_page: number;
  public last_page_url: string;
  public links: Link[];
  public next_page_url: string;
  public path: string;
  public per_page: any;
  public prev_page_url: string;
  public to: number;
  public total: number;

  constructor(data?: object){
    super(data);
    this.current_page = this.current_page || 0;
    this.data = this.data || null;
    this.first_page_url = this.first_page_url || '';
    this.from = this.from || 0;
    this.last_page = this.last_page || 0;
    this.last_page_url = this.last_page_url || '';
    this.links = this.links || [];
    this.next_page_url = this.next_page_url || '';
    this.path = this.path || '';
    this.per_page = this.per_page || '';
    this.prev_page_url = this.prev_page_url || '';
    this.to = this.to || 0;
    this.total = this.total || 0;
  }

  public static cast(object: object): Pagination{
    const {current_page, data, first_page_url, from, last_page, last_page_url, links, next_page_url, path, per_page, prev_page_url, to, total} = new Pagination(object);
    return {current_page, data, first_page_url, from, last_page, last_page_url, links, next_page_url, path, per_page, prev_page_url, to, total};
  }

}


export class ResponsePagination extends Model{
  public code: number;
  public status: string;
  public message: string;
  public data: Pagination | null;
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