import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { ConfigSocketIo } from './../../../../../../common/src/config/configSocketIo';
import { v4 } from 'uuid';
import { IMessage } from './../../../../../../common/src/communication/message/iMessage';
import { Observable, interval } from 'rxjs';
import { Subject } from 'rxjs';
import { fromEvent, asyncScheduler } from 'rxjs';
import { throttle, delay, repeat, throttleTime, tap } from 'rxjs/operators';

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
    // return new Observable(observer => {
    //   this.socket.on(receiveId, (data: IMessage) => {
    //     observer.next(data);
    //   });
    // });

    // https://stackoverflow.com/questions/27748974/rxjs-fromwebsocket-with-socket-io
    var dataStream$ = fromEvent(this.socket, receiveId);
    // return dataStream$;

    // let lastTimeStamp = null;
    // dataStream$.pipe(tap(nextValue => {
    //   lastTimeStamp = (new Date()).getTime();
    // }));

    const delayInterval = 5000;
    const numberOfRepeats = 3;
    // delay by 1000 ms
    // https://rxjs.dev/api/operators/delay
    const delayedDataStream$ = dataStream$.pipe(delay(delayInterval))

    // https://www.learnrxjs.io/learn-rxjs/operators/utility/repeat
    const repeatedDataStream$ = delayedDataStream$.pipe(repeat(numberOfRepeats));

    // https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttle
    // https://rxjs.dev/api/operators/throttle
    const throttledDataStream = repeatedDataStream$.pipe(throttle(val => interval(numberOfRepeats*delayInterval + 1)));
    return throttledDataStream;

    // const throttledDataStream = repeatedDataStream$.pipe(throttleTime((numberOfRepeats*delayInterval + 1), asyncScheduler, {leading: false, trailing: true}), tap(nextValue => {
    //   const currentTimeStamp = (new Date()).getTime();
    //   console.log(currentTimeStamp - lastTimeStamp);
    //   lastTimeStamp = currentTimeStamp;
    // }));
    // return throttledDataStream;
  }

  public registerSend<T extends IMessage>(sendId: string, sendData: Subject<T>) {
    sendData.subscribe((data: IMessage) => {
      this.socket.emit(sendId, data);
    });
  }
}
