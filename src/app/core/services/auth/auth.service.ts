import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { Observable, map } from 'rxjs';
import { ResponseApi } from '../../models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cookieService: CookieService
  ) {

  }

  private get baseUrl() {
    return this.configService.apiUrl + 'auth';
  }

  private get requestOptions() {
    return this.configService.requestOptions;
  }

  public login(data: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/login`;
    return this.http.post(endpoint, data, this.requestOptions).pipe(map((res: ResponseApi) => {
      if (res.code == 200) {
        const auth = res.data.login;
        if (auth) {
          const dataUser = { user: res.data.usuario, person: res.data.persona };
          localStorage.setItem('dataUser', JSON.stringify(dataUser));

          const token_auth = res?.data?.token_auth;
          if (token_auth) {
            this.cookieService.set('token_auth', token_auth);
          }
        }
      }
      return res;
    }));
  }

  public logout(id: any): Observable<ResponseApi> {
    const endpoint = `${this.baseUrl}/logout/${id}`;
    return this.http.get(endpoint, this.requestOptions).pipe(map((res: ResponseApi) => {
      if (res.code == 200) {
        const login: boolean = Boolean(res?.data?.login);
        if (!login) {
          this.cookieService.delete('token_auth');
          localStorage.removeItem('dataUser');
        }
      }
      return res;
    }));
  }
}
