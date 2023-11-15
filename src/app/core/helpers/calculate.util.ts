import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CalculateUtil{
  public static calculateTotal(data: any, calculateFunction: Function) {
    if (!Array.isArray(data) || typeof calculateFunction !== 'function') {
      return 0; // Devuelve 0 si los argumentos no son válidos
    }
  
    return data.reduce((total, item) => {
      const value = calculateFunction(item);
      return total + value;
    }, 0);
  }
}