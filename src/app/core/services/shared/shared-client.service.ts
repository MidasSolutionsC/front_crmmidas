import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedClientService {

  private saleId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private personId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private companyId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private clientId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private legalPerson: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() { }

  // PERSONA
  getSaleId() {
    return this.saleId.asObservable();
  }

  setSaleId(value: number) {
    this.saleId.next(value);
  }

  // PERSONA
  getPersonId() {
    return this.personId.asObservable();
  }

  setPersonId(value: number) {
    this.personId.next(value);
  }

  // EMPRESA
  getCompanyId() {
    return this.companyId.asObservable();
  }

  setCompanyId(value: number) {
    this.companyId.next(value);
  }

  // EMPRESA
  getClientId() {
    return this.clientId.asObservable();
  }

  setClientId(value: number) {
    this.clientId.next(value);
  }

  // PERSONA JURIDICA
  getLegalPerson() {
    return this.legalPerson.asObservable();
  }

  setLegalPerson(value: boolean) {
    this.legalPerson.next(value);
  }
}
