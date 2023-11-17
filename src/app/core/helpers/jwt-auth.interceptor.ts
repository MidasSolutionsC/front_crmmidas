import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token_auth: string = this.cookieService.get('token_auth');
    let req = request;

    if (token_auth) {
      // Enviar ID del usuario
      if (request.body) {
        let dataUser: any = localStorage.getItem('dataUser');
        let user_auth_id: any = 0;
        if (dataUser) {
          dataUser = JSON.parse(dataUser);
          user_auth_id = dataUser.user.id;
        }

        if (request.body instanceof FormData) {
          request.body.set('user_auth_id', user_auth_id);
        } else {
          request.body['user_auth_id'] = user_auth_id;
        }
      }

      // Asignar TOKEN al header
      req = request.clone({
        setHeaders: {
          authorization: `Bearer ${token_auth}`
        }
      })
    }

    return next.handle(req);
  }
}
