import { Injectable } from '@angular/core';
import { rolesRoutes } from '../../../roles-routes.config';


@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  constructor() {

  }



  public userHasAccess(route: string): boolean {
    const dataSession = localStorage.getItem('dataUser');
    const data = JSON.parse(dataSession);
    let routesUser = rolesRoutes[data.user.tipo_usuario]
    if (data.user.tipo_usuario === 'ADMINISTRADOR') return true
    if (!routesUser) return false
    let access = routesUser.filter((v: string[]) => v.includes(route))


    access = access.length > 0

    return access;
  }

}
