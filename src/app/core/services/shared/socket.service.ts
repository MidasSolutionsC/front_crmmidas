import { EventEmitter, Injectable, Output } from '@angular/core';
import { ConfigService } from '../config';
import { Socket } from 'ngx-socket-io';
import { SocketModel } from '../../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket{

  @Output() outEven: EventEmitter<SocketModel> = new EventEmitter();
  
  constructor(
    private configService: ConfigService
  ) { 

    const urlSocket = environment.appConfig.apiUrlSocket;
    const roomName = environment.appConfig.apiKeySocket;

    super({
      url: urlSocket,
      options: {
        auth: {
          token: '123'
        },
        query: {
          nameRoom: roomName
        },
      },
    })

    this.listen();
  }

  public listen = () => {
    this.ioSocket.on('crm_midas', (res: SocketModel) => {
      console.log("EMITTIDO:", res)
      this.outEven.emit(res)
    });
  }

  public emitEvent = (event: SocketModel) => {
    try {
      if (event) {
        this.ioSocket.emit('crm_midas', event);
      }
    } catch (error) {
      console.error('Error al emitir el evento:', error);
    }
  }
}
