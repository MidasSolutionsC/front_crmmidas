import { Model } from "../model";

export class TypeBankAccount extends Model{
  public id: number;
  public nombre: string;
  public abreviacion: string;
  public descripcion: string;
  public is_active: boolean;

  constructor(data?: object){
    super(data);
    this.id = this.id || undefined;
    this.nombre = this.nombre || '';
    this.abreviacion = this.abreviacion || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || true;
  }

  public static cast(data: object): TypeBankAccount{
    const typeBankAccount = new TypeBankAccount(data);
    const {id, nombre, abreviacion, descripcion, is_active} = typeBankAccount;
    return {id, nombre, abreviacion, descripcion, is_active};
  }

  public static cats(dataArray: object[]): TypeBankAccount[]{
    return dataArray.map((data) => TypeBankAccount.cast(data));
  }
}

export class TypeBankAccountList extends Model{
  public id: number;
  public nombre: string;
  public abreviacion: string;
  public descripcion: string;
  public is_active: boolean;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.nombre = this.nombre || '';
    this.abreviacion = this.abreviacion || '';
    this.descripcion = this.descripcion || '';
    this.is_active = this.is_active || false;
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): TypeBankAccountList{
    const typeBankAccountList = new TypeBankAccountList(data);
    const { id, nombre, abreviacion, descripcion, is_active, created_at, updated_at, deleted_at } = typeBankAccountList;
    return {id, nombre, abreviacion, descripcion, is_active, created_at, updated_at, deleted_at};
  }

  public static cats(dataArray: object[]): TypeBankAccountList[]{
    return dataArray.map((data) => TypeBankAccountList.cast(data));
  }
}