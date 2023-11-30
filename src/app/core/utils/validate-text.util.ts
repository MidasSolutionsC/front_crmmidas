export class ValidateTextUtil {

  static truncateMessage(mensaje: string, cantidadMaxima: number): string {
    if (mensaje.length > cantidadMaxima) {
      return mensaje.substring(0, cantidadMaxima) + '...';
    } else {
      return mensaje;
    }
  }

  static validateLongitud(mensaje: string, cantidadMaxima: number): boolean {
    return mensaje.length > cantidadMaxima;
  }
}
