import { Model } from "./model";

export class BankAccount extends Model{
  public id: number;
  public clientes_id: number;
  public tipo_cuentas_bancarias_id: number;
  public cuenta: string;
  public fecha_apertura: string;
  public is_primary: boolean | number;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.clientes_id = this.clientes_id || null;
    this.tipo_cuentas_bancarias_id = this.tipo_cuentas_bancarias_id || null;
    this.cuenta = this.cuenta || null;
    this.fecha_apertura = this.fecha_apertura || null;
    this.is_primary = this.is_primary || 0;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): BankAccount{
    const obj = new BankAccount(data);
    return {
      id: obj.id, 
      clientes_id: obj.clientes_id,
      tipo_cuentas_bancarias_id: obj.tipo_cuentas_bancarias_id,
      cuenta: obj.cuenta,
      fecha_apertura: obj.fecha_apertura,
      is_primary: obj.is_primary,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): BankAccount[]{
    return dataArray.map((data) => BankAccount.cast(data));
  }
}

export class BankAccountList extends Model{
  public id: number;
  public clientes_id: number;
  public tipo_cuentas_bancarias_id: number;
  public tipo_cuentas_bancarias_nombre: string;
  public cuenta: string;
  public fecha_apertura: string;
  public is_primary: boolean | number;
  public is_active: boolean | number;

  constructor(data?: object){
    super(data);
    this.id = this.id || null;
    this.clientes_id = this.clientes_id || null;
    this.tipo_cuentas_bancarias_id = this.tipo_cuentas_bancarias_id || null;
    this.tipo_cuentas_bancarias_nombre = this.tipo_cuentas_bancarias_nombre || null;
    this.cuenta = this.cuenta || null;
    this.fecha_apertura = this.fecha_apertura || null;
    this.is_primary = this.is_primary || 0;
    this.is_active = this.is_active || 1;
  }

  public static cast(data: object): BankAccountList{
    const obj = new BankAccountList(data);
    return {
      id: obj.id, 
      clientes_id: obj.clientes_id,
      tipo_cuentas_bancarias_id: obj.tipo_cuentas_bancarias_id,
      tipo_cuentas_bancarias_nombre: obj.tipo_cuentas_bancarias_nombre,
      cuenta: obj.cuenta,
      fecha_apertura: obj.fecha_apertura,
      is_primary: obj.is_primary,
      is_active: obj.is_active
    };
  }

  public static casts(dataArray: object[]): BankAccountList[]{
    return dataArray.map((data) => BankAccountList.cast(data));
  }
}
