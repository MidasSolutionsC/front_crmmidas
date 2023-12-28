import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ConfigService } from '../../config';
import { BehaviorSubject, Observable, Subscription, catchError, distinctUntilChanged, map, of } from 'rxjs';
import { ResponseApi } from '../../../models/api/response-api.model';
import { TypeDocumentList } from '../../../models';


@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  // private cachedData: User[]; // Almacena los datos en caché
  private cachedData: ResponseApi; // Almacena los datos en caché
  private typeDocumentsSubject: BehaviorSubject<TypeDocumentList[]> = new BehaviorSubject<TypeDocumentList[]>([]);
  public typeDocuments$: Observable<TypeDocumentList[]> = this.typeDocumentsSubject.asObservable();
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { 
    this.typeDocuments$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeDocumentList[]) => {
        if(this.cachedData){
          this.cachedData.data = list;
        }
    })
  }


  private get baseUrl(){
    return this.configService.apiUrl + 'typeDocument';
  }

  private get requestOptions(){
    return this.configService.requestOptions;
  }

  // public getAll(): Observable<any> {
  //   const endpoint = `${this.baseUrl}`;
  //   return this.http.get(endpoint).pipe(map((res: any) => res));
  // }

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

  public register(data: any): Observable<ResponseApi>{
    const endpoint = `${this.baseUrl}`;
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
  addObjectObserver(typeDocument: TypeDocumentList) {
    const currentData = this.typeDocumentsSubject.getValue();
    currentData.push(typeDocument);
    this.typeDocumentsSubject.next(currentData);
  }

  // Método para actualizar todo el array
  addArrayObserver(typeDocuments: TypeDocumentList[]) {
    this.typeDocumentsSubject.next(typeDocuments);
  }

  // Método para modificar un objeto en el array
  updateObjectObserver(updatedTypeDocument: TypeDocumentList) {
    const currentData = this.typeDocumentsSubject.getValue();
    const index = currentData.findIndex(item => item.id === updatedTypeDocument.id);
    if (index !== -1) {
      currentData[index] = updatedTypeDocument;
      this.typeDocumentsSubject.next(currentData);
    }
  }

  // Método para quitar un objeto del array
  removeObjectObserver(id: any) {
    const currentData = this.typeDocumentsSubject.getValue();
    const updatedData = currentData.filter(item => item.id !== id);
    this.typeDocumentsSubject.next(updatedData);
  }
  
}
