import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CanMatchFn } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from 'src/app/account/auth/login/login.component';


export const hasRoleGuard: CanMatchFn = (route, segments) => {
    return true;

};
