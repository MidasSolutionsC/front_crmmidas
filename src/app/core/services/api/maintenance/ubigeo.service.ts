import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map, of } from 'rxjs';
import { ResponseApi } from 'src/app/core/models';
import { UbigeoList } from 'src/app/core/models/api/maintenance/ubigeo.model';
import { ConfigService } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private cachedData: ResponseApi; // Almacena los datos en caché
  private listSubject: BehaviorSubject<UbigeoList[]> = new BehaviorSubject<UbigeoList[]>([]);
  public listObserver$: Observable<UbigeoList[]> = this.listSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { 
    this.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: UbigeoList[]) => {
        if(this.cachedData){
          this.cachedData.data = list;
        }
    })
  }


  private get baseUrl(){
    return this.configService.apiUrl + 'ubigeo';
  }

  private get requestOptions(){
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

  public getSearch(data: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/search`;
    return this.http.post(endpoint, data).pipe(map((res: ResponseApi) => res))
  }

  public getById(ubigeo: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/${ubigeo}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public register(data: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}`;
    return this.http.post(endpoint, data, this.requestOptions).pipe(map((res: ResponseApi) => res))
  }

  public update(data: any, ubigeo: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/${ubigeo}`;
    return this.http.put(endpoint, data).pipe(map((res: ResponseApi) => res))
  }

  public delete(ubigeo: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/${ubigeo}`;
    return this.http.delete(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public restore(ubigeo: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/restore/${ubigeo}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }


  /**
   * FUNCIONES PARA LOS OBSERVABLES
   */
  // Método para agregar un nuevo objeto al array
  addObjectObserver(ubigeoList: UbigeoList) {
    const currentData = this.listSubject.getValue();
    currentData.push(ubigeoList);
    this.listSubject.next(currentData);
  }

  // Método para actualizar todo el array
  addArrayObserver(ubigeoList: UbigeoList[]) {
    this.listSubject.next(ubigeoList);
  }

  // Método para modificar un objeto en el array
  updateObjectObserver(ubigeoList: UbigeoList) {
    const currentData = this.listSubject.getValue();
    const index = currentData.findIndex(item => item.ubigeo === ubigeoList.ubigeo);
    if (index !== -1) {
      currentData[index] = ubigeoList;
      this.listSubject.next(currentData);
    }
  }

  // Método para quitar un objeto del array
  removeObjectObserver(ubigeo: any) {
    const currentData = this.listSubject.getValue();
    const updatedData = currentData.filter(item => item.ubigeo !== ubigeo);
    this.listSubject.next(updatedData);
  }
}
