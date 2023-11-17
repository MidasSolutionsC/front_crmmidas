import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class CurrencyUtil{
  constructor(){}
  
  public static convertCurrencyFormat(amount: number, currency: string, format: string = 'en-US') {
    if(currency == 'PEN'){
      format = 'es-PE';
    }
    
    if(currency == 'EUR'){
      format = 'es-ES';
    }
  
    // Crear un formateador para el formato de origen
    const fromFormatter = new Intl.NumberFormat(format, {
      style: 'currency',
      currency: currency,
      // currencyDisplay: 'code',
      // minimumFractionDigits: 0,
      // maximumFractionDigits: 2,
      // useGrouping: false
    });
  
    // Formatear la cantidad en el formato de origen
    const formattedAmount = fromFormatter.format(amount);
    return formattedAmount;
  }
}