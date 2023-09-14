import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map, of } from 'rxjs';
import { InstallationList, ResponseApi } from 'src/app/core/models';
import { ConfigService } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class TempInstallationService {
  private cachedData: ResponseApi; // Almacena los datos en caché
  private listSubject: BehaviorSubject<InstallationList[]> = new BehaviorSubject<InstallationList[]>([]);
  public listObserver$: Observable<InstallationList[]> = this.listSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { 
    this.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: InstallationList[]) => {
        if(this.cachedData){
          this.cachedData.data = list;
        }
    })
  }


  private get baseUrl(){
    return this.configService.apiUrl + 'tmpInstallation';
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
  addObjectObserver(installationList: InstallationList) {
    const currentData = this.listSubject.getValue();
    currentData.push(installationList);
    this.listSubject.next(currentData);
  }

  // Método para actualizar todo el array
  addArrayObserver(installationList: InstallationList[]) {
    this.listSubject.next(installationList);
  }

  // Método para modificar un objeto en el array
  updateObjectObserver(installationList: InstallationList) {
    const currentData = this.listSubject.getValue();
    const index = currentData.findIndex(item => item.id === installationList.id);
    if (index !== -1) {
      currentData[index] = installationList;
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
