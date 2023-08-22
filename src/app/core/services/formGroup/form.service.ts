import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  modelToFormGroupData(model: any): any {
    const result = {};
    for (const property of Object.keys(model)) {
      result[property] = [model[property]];
    }
    return result;
  }
}
