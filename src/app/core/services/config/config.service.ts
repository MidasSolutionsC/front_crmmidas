import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
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
  public get appConfig(): any{
    return environment.appConfig;
  }

  /**
   * OBTENER LA URL API
   */
  public get apiUrl(): any{
    return environment.appConfig.apiUrl;
  }

  /**
   * OBTENER LA URL API
   */
  private get getHeaders(): any{
    // return environment.appConfig.apiUrl;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  /**
   * OPTIONS
   */
  public get requestOptions(): { headers: HttpHeaders } {
    // this.subscriptions.add(
    //   this.webapi.getIsTokenWeb().subscribe(
    //     (token: string) => (this.authToken = token)
    //   )
    // );

    // const authTokenWeb = this.authToken;
    const apiKey = environment.appConfig.apiKey;
    
    const headers: HttpHeaders = new HttpHeaders().set('API-KEY', `${apiKey}`);
    return {
      headers: headers
    };
  }
}
