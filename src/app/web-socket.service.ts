import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestObject, SuccessObject } from 'jsonrpc-lite';
import { BehaviorSubject, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { v4 } from 'uuid';
import { ConfigSocketIo } from '../../../common/src/config/configSocketIo';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private isUiBlocked$: BehaviorSubject<boolean>;
  private webSocketConnection = new Subject<any>();

  public static userId = v4();

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  private requestConnectionWithRandomPort(): Promise<any> {
    const userId = WebSocketService.userId;
    const url = ConfigSocketIo.SOCKET_IO_SERVER_URL + ':' + ConfigSocketIo.PORT + '/' + ConfigSocketIo.API_PATH + '/' + ConfigSocketIo.CONNECTION_PATH;
    return this.httpClient.post(url,
      {
        userId: userId
      }).toPromise();
  }

  public send(msg: SuccessObject | RequestObject) {
    this.webSocketConnection.next(msg.serialize());
    // https://stackoverflow.com/questions/35546421/how-to-get-a-variable-type-in-typescript
    if (msg instanceof RequestObject){
      this.isUiBlocked$.next(true);
      // DEBUGGIN:
      // console.log('sent:'+ msg.serialize());
    } 
  }

  public init(isUiBlocked$: BehaviorSubject<boolean>) {
    this.isUiBlocked$ = isUiBlocked$;
    return new Promise((resovle: (value?: any) => void) => {
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
            protocol: 'websocket',
            serializer: (msg) => {
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
        resovle();

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
    });
  }

  registerReceive(): Subject<any> {
    return this.webSocketConnection;
  }
}
