import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CleanObject {
  constructor() {}

  public static removeNullFields(obj: any): any {
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === '') {
        delete obj[key];
      }
    });
    return obj;
  }

  public static assignNullFields(obj: any): any {
    Object.keys(obj).forEach(key => {
      if (obj[key] === '') {
        obj[key] = null;
      }
    });
    return obj;
  }

  public static cleanArrayOfObjects(arr: any[]): any[] {
    return arr.map((item) => {
      Object.keys(item).forEach(key => {
        if (item[key] === null || item[key] === '') {
          delete item[key];
        }
      });
      return item;
    });
  }
}
