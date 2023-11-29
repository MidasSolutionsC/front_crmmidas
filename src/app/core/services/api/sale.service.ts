import { Injectable } from '@angular/core';
import { ResponseApi } from '../../models';
import { BehaviorSubject, Observable, distinctUntilChanged, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config';
import { SaleList } from '../../models/api/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private cachedData: ResponseApi; // Almacena los datos en caché
  private listSubject: BehaviorSubject<SaleList[]> = new BehaviorSubject<SaleList[]>([]);
  public listObserver$: Observable<SaleList[]> = this.listSubject.asObservable();

  private dataSubject: BehaviorSubject<SaleList> = new BehaviorSubject<SaleList>(null);
  public dataObserver$: Observable<SaleList> = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: SaleList[]) => {
        if (this.cachedData) {
          this.cachedData.data = list;
        }
      })
  }


  private get baseUrl() {
    return this.configService.apiUrl + 'sale';
  }

  private get requestOptions() {
    return this.configService.requestOptions;
  }

  /**
   * Listar todos los registros
   * @returns response, con el listado de los registros
   */
  public getAll(forceRefresh: boolean = false): Observable<ResponseApi> {
    if (this.cachedData && !forceRefresh) {
      this.addArrayObserver(this.cachedData.data);
      return of(this.cachedData); // Devuelve datos en caché si están disponibles
    } else {
      return this.http.get(`${this.baseUrl}`).pipe(
        map((res: ResponseApi) => {
          this.addArrayObserver(res.data);
          this.cachedData = res; // Almacena los datos en caché
          return res;
        })
      );
    }
  }
  
  public getPagination(data: any): Observable<ResponseApi> {
    const queryParams = new URLSearchParams();
    queryParams.set('data', JSON.stringify(data));
    const endpoint = `${this.baseUrl}/index?${queryParams.toString()}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public getById(id: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public getByIdWithAllReference(id: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/getWithAllReference/${id}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public register(data: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}`;
    return this.http.post(endpoint, data, this.requestOptions).pipe(map((res: ResponseApi) => res))
  }

  public update(data: any, id: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/update/${id}`;
    return this.http.post(endpoint, data).pipe(map((res: ResponseApi) => res))
  }

  public finalProcess(data: any, id: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/finalProcess/${id}`;
    return this.http.post(endpoint, data, this.requestOptions).pipe(map((res: ResponseApi) => res))
  }

  public cancelProcess(data: any, id: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/cancelProcess/${id}`;
    return this.http.post(endpoint, data, this.requestOptions).pipe(map((res: ResponseApi) => res))
  }

  public delete(id: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.delete(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public restore(id: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/restore/${id}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }


  /**
   * FUNCIONES PARA LOS OBSERVABLES
   */
  // Método para agregar un nuevo valor al data observer
  changeDataObserver(saleList: SaleList) {
    this.dataSubject.next(saleList);
  }


  // Método para agregar un nuevo objeto al array
  addObjectObserver(saleList: SaleList) {
    const currentData = this.listSubject.getValue();
    currentData.push(saleList);
    this.listSubject.next(currentData);
  }

  // Método para actualizar todo el array
  addArrayObserver(saleList: SaleList[]) {
    this.listSubject.next(saleList);
  }

  // Método para modificar un objeto en el array
  updateObjectObserver(saleList: SaleList) {
    const currentData = this.listSubject.getValue();
    const index = currentData.findIndex(item => item.id === saleList.id);
    if (index !== -1) {
      currentData[index] = saleList;
      this.listSubject.next(currentData);
    }
  }

  // Método para quitar un objeto del array
  removeObjectObserver(id: any) {
    const currentData = this.listSubject.getValue();
    const updatedData = currentData.filter(item => item.id !== id);
    this.listSubject.next(updatedData);
  }
}
