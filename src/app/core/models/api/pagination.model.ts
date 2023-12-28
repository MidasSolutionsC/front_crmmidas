import { Model } from "./model";

export class Pagination extends Model{
  public page: number;
  public perPage: number;
  public search: string;
  public column: string;
  public order: 'asc' | 'desc';

  constructor(data?: object){
    super(data);
    this.page = this.page || 1;
    this.perPage = this.perPage || 10;
    this.search = this.search || null;
    this.column = this.column || null;
    this.order = this.order || 'desc';
  }

  public static cast(object: object): Pagination{
    const obj = new Pagination(object);
    return {
      page: obj.page,
      perPage: obj.perPage,
      search: obj.search,
      column: obj.column,
      order: obj.order,
    }
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

export class PaginationResult extends Model{
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
    this.data = this.data || [];
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

  public static cast(object: object): PaginationResult{
    const obj= new PaginationResult(object);
    return {
      current_page: obj.current_page,
      data: obj.data,
      first_page_url: obj.first_page_url,
      from: obj.from,
      last_page: obj.last_page,
      last_page_url: obj.last_page_url,
      links: obj.links,
      next_page_url: obj.next_page_url,
      path: obj.path,
      per_page: obj.per_page,
      prev_page_url: obj.prev_page_url,
      to: obj.to,
      total: obj.total,
    }
  }
}

