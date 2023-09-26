import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CanMatchFn } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from 'src/app/account/auth/login/login.component';


export const hasRoleGuard: CanActivateFn = (route, segments) => {

    console.log(segments.url)

    const router = inject(Router);

    const url = segments.url
    const dataSession = localStorage.getItem('dataUser');
    const data = JSON.parse(dataSession);

    if (url === '/account/login') return true
    if (url === '/') return true
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


            router.navigate(['/account/login']);
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



            router.navigate(['/account/login']);
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


            router.navigate(['/account/login']);
            return false;

        default:
            router.navigate(['/account/login']);
            return false;
    }





};
