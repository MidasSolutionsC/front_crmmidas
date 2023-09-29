import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const guestGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token_check = cookieService.check('token_auth');
  if (token_check) {
    router.navigate(['/main']);
    return false;
  }

  return true;
};
