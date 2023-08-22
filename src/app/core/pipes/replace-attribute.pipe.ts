import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceAttribute'
})
export class ReplaceAttributePipe implements PipeTransform {

  transform(value: string, fieldName: string, replacementValue: string): string {
    return value.replace(fieldName, replacementValue);
  }
}
