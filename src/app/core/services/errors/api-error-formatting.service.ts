import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorFormattingService {

  constructor() { }

  // Formatear errores de la API como un array de objetos
  formatAsArray(apiErrors: { [key: string]: string[] }): any[] {
    const errorArray = [];
    for (const key in apiErrors) {
      if (apiErrors.hasOwnProperty(key)) {
        errorArray.push({ [key]: apiErrors[key].join(' ') });
      }
    }
    return errorArray;
  }

  // Formatear errores de la API como una cadena con HTML personalizado
  formatAsHtml(apiErrors: { [key: string]: string[] }): string {
    const errorString = [];
    for (const key in apiErrors) {
      if (apiErrors.hasOwnProperty(key)) {
        errorString.push(`<b>${key}:</b> ${apiErrors[key].join(' ')}`);
      }
    }
    return errorString.join('<br>');
  }

}
