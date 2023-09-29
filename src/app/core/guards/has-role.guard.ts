import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CanMatchFn } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from 'src/app/account/auth/login/login.component';
import { AccessControlService } from '../services/auth/accessControl.service';


export const hasRoleGuard: CanActivateFn = (route, segments) => {
    const router = inject(Router);
    const url = segments.url

    const authService = new AccessControlService()
    console.log(authService.userHasAccess(url))

    if (authService.userHasAccess(url)) {
        return true
    } else {
        router.navigate(['/main']);
        return false;
    }

};
