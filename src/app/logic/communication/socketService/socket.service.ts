import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { ConfigSocketIo } from './../../../../../../common/src/config/configSocketIo';
import { v4 } from 'uuid';
import { IMessage } from './../../../../../../common/src/communication/message/iMessage';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public static userId: string;
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(ConfigSocketIo.SOCKET_IO_SERVER_URL + ConfigSocketIo.PORT);
    SocketService.userId = v4();
  }

  // cf. https://github.com/luixaviles/socket-io-typescript-chat/blob/master/client/src/app/shared/socket.service.ts
  public registerReceive(receiveId: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(receiveId, (data: IMessage) => {
        observer.next(data);
      });
    });
  }

  public registerSend(sendId: string, sendData: Subject<any>) {
    sendData.subscribe((data: IMessage) => {
      this.socket.emit(sendId, data);
    });
  }
}
