import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, map, of } from 'rxjs';
import { ResponseApi } from '../models/response-api.model';


@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  private cachedData: any; // Almacena los datos en caché

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

  public getAll(): Observable<ResponseApi> {
    if (this.cachedData) {
      return of(this.cachedData); // Devuelve datos en caché si están disponibles
    } else {
      return this.http.get(`${this.baseUrl}`).pipe(
        map((res: any) => {
          this.cachedData = res; // Almacena los datos en caché
          return res;
        })
      );
    }
  }
}
