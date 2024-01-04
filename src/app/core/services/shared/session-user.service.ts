import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Company, Person, PersonList, UserList } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class SessionUserService {

  private dataPerson: BehaviorSubject<PersonList> = new BehaviorSubject<PersonList>(null);
  private dataCompany: BehaviorSubject<Company> = new BehaviorSubject<Company>(null);
  private dataUser: BehaviorSubject<UserList> = new BehaviorSubject<UserList>(null);
  private clearData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {
    this.clearData.asObservable().subscribe((value: boolean) => {
      if(value){
        this.dataPerson.next(null);
        this.dataCompany.next(null);
        this.dataUser.next(null);
        // this.clearData.next(null);
      }
    });
   }


     // RESET DATOS 
  getClearData() {
    return this.clearData.asObservable();
  }

  setClearData(value: boolean) {
    this.clearData.next(value);
  }

  // DATOS PERSONA
  getDataPerson() {
    return this.dataPerson.asObservable();
  }

  setDataPerson(value: PersonList) {
    this.dataPerson.next(value);
  }

  // DATOS EMPRESA
  getDataCompany() {
    return this.dataCompany.asObservable();
  }

  setDataCompany(value: Company) {
    this.dataCompany.next(value);
  }

  // DATOS USUARIO
  getDataUser() {
    return this.dataUser.asObservable();
  }

  setDataUser(value: UserList) {
    this.dataUser.next(value);
  }
}
