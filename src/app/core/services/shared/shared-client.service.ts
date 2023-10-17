import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address, Company, Person } from '../../models';
import { Client } from '../../models/api/client.model';

@Injectable({
  providedIn: 'root'
})
export class SharedClientService {

  private saleId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private personId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private companyId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private clientId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private typeClient: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private legalPerson: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private submitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private clearData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private address: BehaviorSubject<Address[]> = new BehaviorSubject<Address[]>(null);
  private dataPerson: BehaviorSubject<Person> = new BehaviorSubject<Person>(null);
  private dataCompany: BehaviorSubject<Company> = new BehaviorSubject<Company>(null);
  private dataClient: BehaviorSubject<Client> = new BehaviorSubject<Client>(null);

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

  // TIPO DE CLIENTE
  getTypeClient() {
    return this.typeClient.asObservable();
  }

  setTypeClient(value: string) {
    this.typeClient.next(value);
  }

  // ENVIAR DATOS 
  getSubmitData() {
    return this.submitData.asObservable();
  }

  setSubmitData(value: boolean) {
    this.submitData.next(value);
  }

  // RESET DATOS 
  getClearData() {
    return this.clearData.asObservable();
  }

  setClearData(value: boolean) {
    this.clearData.next(value);
  }

  // DIRECCIÓN 
  getAddress() {
    return this.address.asObservable();
  }

  setAddress(value: any) {
    this.address.next(value);
  }

  // DATOS PERSONA
  getDataPerson() {
    return this.dataPerson.asObservable();
  }

  setDataPerson(value: Person) {
    this.dataPerson.next(value);
  }

  // DATOS EMPRESA
  getDataCompany() {
    return this.dataCompany.asObservable();
  }

  setDataCompany(value: Company) {
    this.dataCompany.next(value);
  }

  // DATOS CLIENTE
  getDataClient() {
    return this.dataClient.asObservable();
  }

  setDataClient(value: Client) {
    this.dataClient.next(value);
  }
}
