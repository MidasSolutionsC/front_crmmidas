import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileUploadUtil {
  constructor() {}

  public static handleFileUpload(
    fileInput: HTMLInputElement,
    allowedExtensions: string[] = [],
    maxFileSizeBytes: number = 0,
    maxFileSizePerType: Record<string, number> = {} // Objeto de configuración de peso máximo por tipo de archivo
  ): { files: File[], error: string | null } {
    const files: File[] = [];

    if (fileInput.files && fileInput.files.length > 0) {
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const extension = file.name.split('.').pop().toLowerCase();

        if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
          fileInput.value = ''; // Limpiar el input
          return { files: [], error: `Extensión no permitida para el archivo ${file.name}.` };
        }

        if (maxFileSizeBytes > 0 && file.size > maxFileSizeBytes) {
          fileInput.value = ''; // Limpiar el input
          return { files: [], error: `Tamaño de archivo demasiado grande para ${file.name}.` };
        }

        // Validación de peso máximo por tipo de archivo
        if (maxFileSizePerType.hasOwnProperty(extension) && file.size > maxFileSizePerType[extension]) {
          fileInput.value = ''; // Limpiar el input
          return {
            files: [],
            error: `Tamaño de archivo demasiado grande para ${file.name}.`,
          };
        }

        files.push(file);
      }
      return { files, error: null };
    }

    return { files: [], error: 'No se seleccionaron archivos.' };
  }

  /**
   * Esta función permite validar el tipo de archivo subido y el peso permitido
   * @param fileInput 
   * @param allowedExtensions 
   * @param maxFileSizeBytes 
   * @param maxFileSizePerType 
   * @returns objeto 
   */
  public static async handleFileUploadBase64(
    fileInput: HTMLInputElement,
    allowedExtensions: string[] = [],
    maxFileSizeBytes: number = 0,
    maxFileSizePerType: Record<string, number> = {} // Objeto de configuración de peso máximo por tipo de archivo
  ): Promise<{ files: { base64: string; file: File }[], error: string | null }> {
    const files: { base64: string; file: File }[] = [];

    if (fileInput.files && fileInput.files.length > 0) {
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const extension = file.name.split('.').pop().toLowerCase();

        if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
          fileInput.value = ''; // Limpiar el input
          return {
            files: [],
            error: `Extensión no permitida para el archivo ${file.name}.`,
          };
        }

        if (maxFileSizeBytes > 0 && file.size > maxFileSizeBytes) {
          fileInput.value = ''; // Limpiar el input
          return {
            files: [],
            error: `Tamaño de archivo demasiado grande para ${file.name}.`,
          };
        }

        // Validación de peso máximo por tipo de archivo
        if (maxFileSizePerType.hasOwnProperty(extension) && file.size > maxFileSizePerType[extension]) {
          fileInput.value = ''; // Limpiar el input
          return {
            files: [],
            error: `Tamaño de archivo demasiado grande para ${file.name}.`,
          };
        }

        // Obtener la representación Base64 del archivo
        const base64 = await this.readFileAsBase64(file);
        files.push({ base64, file });
      }
      return { files, error: null };
    }

    return { files: [], error: 'No se seleccionaron archivos.' };
  }

  private static async readFileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          reject('Error al leer el archivo como Base64.');
        }
      };
      reader.onerror = () => {
        reject('Error al leer el archivo como Base64.');
      };
      reader.readAsDataURL(file);
    });
  }
}
