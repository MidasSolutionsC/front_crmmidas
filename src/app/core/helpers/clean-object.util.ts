import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CleanObject {
  constructor() {}

  public static removeNullFields(obj: any): any {
    Object.keys(obj).forEach(key => {
      if (obj[key] === null) {
        delete obj[key];
      }
    });
    return obj;
  }

  public static cleanArrayOfObjects(arr: any[]): any[] {
    return arr.map((item) => {
      Object.keys(item).forEach(key => {
        if (item[key] === null) {
          delete item[key];
        }
      });
      return item;
    });
  }
}
