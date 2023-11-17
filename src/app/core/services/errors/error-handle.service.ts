import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  private errors: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() { }

  getErrors(): Observable<any[]> {
    return this.errors.asObservable();
  }

  addError(error: string): void {
    const currentErrors = this.errors.getValue();
    currentErrors.push(error);
    this.errors.next(currentErrors);
  }

  clearErrors(): void {
    this.errors.next([]);
  }
}
