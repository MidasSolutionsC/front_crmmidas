import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const jwtAuthGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token_check = cookieService.check('token_auth');
  if (!token_check) {
    // router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
    router.navigate(['/account/login']);
    return false;
  } else {
    console.log('aqui', state.url)

    const url = state.url
    const dataSession = localStorage.getItem('dataUser');
    const data = JSON.parse(dataSession);

    if (url === '/main') return true


    switch (data.user.tipo_usuario) {

      case 'ADMINISTRADOR':

        return true
      case 'VENDEDOR':
        console.log('HOLA')


        if (url.startsWith('/sale'))
          return true;
        if (url.startsWith('/call'))
          return true;

        if (url.startsWith('/calendar'))
          return true;


        router.navigate(['/main']);
        return false;


      case 'BACKOFFICE':


        if (url.startsWith('/sale'))
          return true;
        if (url.startsWith('/call'))
          return true;

        if (url.startsWith('/calendar'))
          return true;

        if (url.startsWith('/maintenances/manual'))
          return true;



        router.navigate(['/main']);
        return false;

      case 'COORDINADOR':


        if (url.startsWith('/sale'))
          return true;
        if (url.startsWith('/call'))
          return true;

        if (url.startsWith('/calendar'))
          return true;

        if (url.startsWith('/maintenances/manual'))
          return true;

        if (url.startsWith('/maintenances/promotion'))
          return true;
        if (url.startsWith('/maintenances/advertisement'))
          return true;
        if (url.startsWith('/maintenances/group'))
          return true;


        router.navigate(['/main']);
        return false;

      default:
        router.navigate(['/main']);
        return false;
    }

  }

};
