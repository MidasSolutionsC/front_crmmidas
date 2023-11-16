import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

interface ISweetAlert {
  type?: 'warning' | 'error' | 'success' | 'info',
  title?: string,
  message?: string,
  timer?: number | undefined
}

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  private swalInstance: any;

  constructor() { }

  timerLoading() {
    let timerInterval;
    Swal.fire({
      title: 'Auto close alert!',
      html: 'I will close in <b></b> milliseconds.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b: any = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }

  loadingUp(title: string = 'Enviando datos') {
    let timerValue = 0;
    let timerInterval;
    let isStopped = false;

    try {
      this.swalInstance = Swal.fire({
        title: title,
        html: `
        <div class="w-100">
          <div class="loader-content">
            <div>Cargando... <b>0%</b> por favor espere!</div>
            <div><button id="stopButton" class="btn btn-dark rounded-full d-none">Stop</button></div>
          </div>
        </div>`,
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          const b: any = Swal.getHtmlContainer().querySelector('b');
          const stopButton: any = Swal.getHtmlContainer().querySelector('#stopButton');

          if (stopButton) {
            stopButton.addEventListener('click', () => {
              isStopped = true;
              clearInterval(timerInterval);
              this.stop();
            });
            // stopButton.classList.remove('d-none'); // Mostrar el botón "Stop"
          }

          const updateProgress = () => {
            if (!isStopped) {
              timerValue = (timerValue + 1) % 101; // Garantizar que timerValue esté en el rango 0-100
              if (b) {
                b.textContent = `${timerValue}%`;
              }
            }
          };

          timerInterval = setInterval(updateProgress, 250);
          updateProgress(); // Inicia la actualización inmediatamente
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
    } catch (error) {
      // Maneja errores aquí, por ejemplo, registra el error en la consola
      console.error('Error al abrir SweetAlert:', error);
    }
  }

  loadingUp2(title: string = 'Enviando datos') {
    Swal.fire({
      title: title,
      text: '...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
  }

  stop() {
    if (this.swalInstance) {
      this.swalInstance.close();
    }
    Swal.close()
  }

  timer() {
    let timerInterval;
    Swal.fire({
      title: 'Auto close alert!',
      html: 'I will close in <strong></strong> seconds.',
      timer: 2000,

      didOpen: () => {
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft() + ''
            }
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (
        result.dismiss === Swal.DismissReason.timer
      ) {
        console.log('I was closed by the timer');
      }
    });
  }

  showLoader(title = 'Cargando...', text = 'Espera mientras procesamos tu solicitud') {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  hileLoader() {
    Swal.close()
  }

  showTopEnd(data: ISweetAlert) {
    Swal.fire({
      position: 'top-end',
      icon: data.type || 'success',
      title: data.title || 'Alerta',
      html: data.message || '',
      showConfirmButton: false,
      toast: true,
      timer: data.timer || undefined,
      timerProgressBar: data.timer !== undefined ? true : false
    });
  }

  showCenter(data: ISweetAlert) {
    Swal.fire({
      position: 'center',
      icon: data.type || 'success',
      title: data.title || 'Alerta',
      html: data.message || '',
      showConfirmButton: false,
      toast: true,
      timer: data.timer || undefined,
      timerProgressBar: data.timer !== undefined ? true : false
    });
  }

  showSuccessAlert(message: string): void {
    Swal.fire('Éxito', message, 'success');
  }

  showErrorAlert(message: string): void {
    Swal.fire('Error', message, 'error');
  }

  showWarningAlert(message: string): void {
    Swal.fire('Warning', message, 'warning');
  }

  showConfirmationAlert(message: string): Promise<any> {
    return Swal.fire({
      title: 'Confirmación',
      text: message,
      icon: 'question',
      reverseButtons: true,
      showCancelButton: true,
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });
  }

}
