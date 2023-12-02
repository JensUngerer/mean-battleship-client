import { Injectable } from '@angular/core';
import { ConfigSocketIo } from '../../../common/src/config/configSocketIo';
import { HttpClient } from '@angular/common/http';
import { v4 } from 'uuid';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private webSocketConnection = new Subject<any>();

  public static userId = v4();

  constructor(
    private httpClient: HttpClient,
  ) {
  }


  // getSubject(): Subject<any> {
  //   return this.webSocketConnection;
  // }

  private requestConnectionWithRandomPort(): Promise<any> {
    const userId = WebSocketService.userId;
    const url = ConfigSocketIo.SOCKET_IO_SERVER_URL + ':' + ConfigSocketIo.PORT + '/' + ConfigSocketIo.API_PATH + '/' + ConfigSocketIo.CONNECTION_PATH;
    return this.httpClient.post(url,
      {
        userId: userId
      }).toPromise();
  }

  public init() {
    const initWebsocketPromise: Promise<any> = this.requestConnectionWithRandomPort();
    initWebsocketPromise.then((response: any) => {
      // DEBUGGING: show response with randomPort
      // console.log(JSON.stringify(response, null, 4));

      const connectionPort = response.port;
      // https://rxjs.dev/api/webSocket/webSocket
      const url = ConfigSocketIo.SOCKET_IO_SERVER_URL_WS + ':' + connectionPort;
      this.webSocketConnection = webSocket(
        { 
          url: url, 
          protocol: 'websocket' ,
          serializer: (msg) =>{
            // DEBUGGING:
            // console.log('after serialization:' + msg);
            return msg; 
          },
          // deserializer: (msg) => {
          //   console.log('after deserialization:' + JSON.stringify(msg, null, 4));
          //   return msg;
          // }
        }
        );

      // DEBUGING: receiving data
      // this.webSocketConnection.subscribe({
      //   next: (message) => {
      //     console.log(JSON.stringify(message));
      //   }
      // });

      // // sending data
      // // DEBUGGING: send string message to server
      // this.webSocketConnection.next('ping');


    });
    initWebsocketPromise.catch((error: any) => {
      console.log(JSON.stringify(error, null, 4));
    });

    return initWebsocketPromise;
  }

  registerReceive(): Subject<any> {
    return this.webSocketConnection;
  }
}
