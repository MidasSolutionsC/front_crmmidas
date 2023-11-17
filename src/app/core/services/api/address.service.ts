import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map, of } from 'rxjs';
import { AddressList, ResponseApi } from '../../models';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private cachedData: ResponseApi; // Almacena los datos en caché
  private listSubject: BehaviorSubject<AddressList[]> = new BehaviorSubject<AddressList[]>([]);
  public listObserver$: Observable<AddressList[]> = this.listSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: AddressList[]) => {
        if(this.cachedData){
          this.cachedData.data = list;
        }
    })
  }


  private get baseUrl(){
    return this.configService.apiUrl + 'address';
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

  
  public getFilterPersonId(personId: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/filterPerson/${personId}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public getFilterCompanyId(companyId: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/filterCompany/${companyId}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public getById(id: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public register(data: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}`;
    return this.http.post(endpoint, data, this.requestOptions).pipe(map((res: ResponseApi) => res))
  }

  public registerComplete(data: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/register`;
    return this.http.post(endpoint, data, this.requestOptions).pipe(map((res: ResponseApi) => res))
  }

  public update(data: any, id: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.put(endpoint, data).pipe(map((res: ResponseApi) => res))
  }

  public delete(id: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.delete(endpoint).pipe(map((res: ResponseApi) => res))
  }

  public restore(id: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}/restore/${id}`;
    return this.http.get(endpoint).pipe(map((res: ResponseApi) => res))
  }


  /**
   * FUNCIONES PARA LOS OBSERVABLES
   */
  // Método para agregar un nuevo objeto al array
  addObjectObserver(addressList: AddressList) {
    const currentData = this.listSubject.getValue();
    currentData.push(addressList);
    this.listSubject.next(currentData);
  }

  // Método para actualizar todo el array
  addArrayObserver(addressList: AddressList[]) {
    this.listSubject.next(addressList);
  }

  // Método para modificar un objeto en el array
  updateObjectObserver(addressList: AddressList) {
    const currentData = this.listSubject.getValue();
    const index = currentData.findIndex(item => item.id === addressList.id);
    if (index !== -1) {
      currentData[index] = addressList;
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
