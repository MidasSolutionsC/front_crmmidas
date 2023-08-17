import { Model } from "./model";

export class User extends Model{
  public id: number;
  public personas_id: number;
  public tipo_usuarios_id: number;
  public nombre_usuario: string;
  public clave: string;
  public foto_perfil: string;
  public session_activa: boolean;
  public is_active: boolean;
  public ultima_conexion: string;
  public api_token: string;
  public expires_at: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  constructor(data?: object){
    super(data);
    this.id = this.id || 0;
    this.personas_id = this.personas_id || 0;
    this.tipo_usuarios_id = this.tipo_usuarios_id || 0;
    this.nombre_usuario = this.nombre_usuario || '';
    this.clave = this.clave || '';
    this.foto_perfil = this.foto_perfil || '';
    this.session_activa = this.session_activa || false;
    this.is_active = this.is_active || false;
    this.ultima_conexion = this.ultima_conexion || '';
    this.api_token = this.api_token || '';
    this.expires_at = this.expires_at || '';
    this.created_at = this.created_at || '';
    this.updated_at = this.updated_at || '';
    this.deleted_at = this.deleted_at || '';
  }

  public static cast(data: object): User{
    return new User(data);
  }

  public static casts(dataArray: object[]): User[]{
    return dataArray.map((data) => User.cast(data));
  }
}