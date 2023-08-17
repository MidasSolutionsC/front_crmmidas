import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  URL = 'assets/dashboard.json';

  constructor(private http: HttpClient) { }

  getConfig() : Observable<any> {
    return this.http.get<any>(`${this.URL}`)
  }

  /**
   * OBTENER LA CONFIGURACIÓN DEL ENVIRONMENT
   */
  public get getAppConfig(): any{
    return environment.appConfig;
  }

  /**
   * OBTENER LA URL API
   */
  public get getApiUrl(): any{
    return environment.appConfig.apiUrl;
  }
}
