import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ResponseApi } from '../models/response-api.model';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  private cachedData: User[]; // Almacena los datos en caché

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }


  private get baseUrl(){
    return this.configService.getApiUrl + 'typeDocument/';
  }

  // public getAll(): Observable<any> {
  //   const endpoint = `${this.baseUrl}`;
  //   return this.http.get(endpoint).pipe(map((res: any) => res));
  // }

  public getAll(): Observable<User[]> {
    if (this.cachedData) {
      return of(this.cachedData); // Devuelve datos en caché si están disponibles
    } else {
      return this.http.get(`${this.baseUrl}`).pipe(
        map((res: ResponseApi) => {
          if(res.code == 200){
            this.cachedData = res.data; // Almacena los datos en caché
          } else {
            // Emitir errores
          }
          return res.data;
        })
      );
    }
  }


}
