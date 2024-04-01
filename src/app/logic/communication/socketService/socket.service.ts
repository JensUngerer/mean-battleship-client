import { Injectable, OnDestroy } from '@angular/core';
import { ConfigSocketIo } from './../../../../../../common/src/config/configSocketIo';
import { v4 } from 'uuid';
import { IMessage } from './../../../../../../common/src/communication/message/iMessage';
import { Observable, interval, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { fromEvent, asyncScheduler } from 'rxjs';
import { throttle, delay, repeat, throttleTime, tap } from 'rxjs/operators';
import { SocketIoReceiveTypes } from '../../../../../../common/src/communication/socketIoReceiveTypes';
<<<<<<< HEAD
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
=======
import io from 'socket.io-client';
>>>>>>> using-json-rpc-messages

export class SocketIoSubscriptionMappingSender {
  private sendId: string;
  private send$: ReplaySubject<any>;
  private sendSubscription: Subscription;

  private onSendId<T extends IMessage>(data: T) {
    // https://rxjs.dev/api/webSocket/webSocket
    this.webSocketSubject.next(data);
    // this.send$.next(data);
  }

  constructor(private webSocketSubject: WebSocketSubject<IMessage>) {
    // const subscritption = this.webSocketSubject.subscribe();
  }

  onSend<T extends IMessage>(sendId: string) {
    this.send$ = new ReplaySubject<any>();
    this.sendId = sendId;
    this.sendSubscription = this.send$.pipe(tap(this.onSendId.bind(this))).subscribe();
    // this.sendSubscription = this.webSocketSubject
    // .pipe(tap(this.onSendId.bind(this)))
    // .subscribe()
    return this.send$;
  }

  onDestroy() {
    if (this.sendSubscription) {
      this.sendSubscription.unsubscribe();
    }
    // if (this.webSocketSubject){
    //   this.webSocketSubject.complete();
    // }
  }

}

export class SocketIoSubscriptionMappingReceiver {
  static INITIAL_VALUE: IMessage = {
    sourceUserId: '',
    type: SocketIoReceiveTypes.InitialValue
  };

  private receiver$: BehaviorSubject<any>;

  private registeredReceiveId: string;
  private subcription: Subscription;


  private onReceiveId(data: IMessage) {
    console.log(data);
    console.log(JSON.stringify(data));
    this.receiver$.next(data);
  }

  constructor(private webSocketSubject: WebSocketSubject<IMessage>) {
    
  }

  onReceive(receiveId: string) {
    this.receiver$ = new BehaviorSubject<any>(SocketIoSubscriptionMappingReceiver.INITIAL_VALUE);

    this.subcription = this.webSocketSubject.subscribe({
      next: this.onReceiveId.bind(this),
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    // this.receiver$ = this.webSocketSubject.multiplex(()=> ({subscribe: 'A'}, ()=> {{unsubscribe: 'A'}}, message => message.type === 'A'));

    // this.webSocketSubject.on(receiveId, this.onReceiveId.bind(this));

    this.registeredReceiveId = receiveId;

    return this.receiver$;
  }

  onDestroy() {
    // this.webSocketSubject.removeListener(this.registeredReceiveId, this.onReceiveId.bind(this));
    if (this.subcription){
      this.subcription.unsubscribe();
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
<<<<<<< HEAD
  public static userId: string;
  private webSocketSubject: WebSocketSubject<IMessage>;
  // private socket: any;
=======
  // public static userId: string;
  private socket: any;
>>>>>>> using-json-rpc-messages
  private receiveIdObservableMapping: { [key: string]: SocketIoSubscriptionMappingReceiver } = {};
  private sendIdObservableMapping: { [key: string]: SocketIoSubscriptionMappingSender } = {};
  private subscription: Subscription;

  constructor() {
    // this.socket = io((ConfigSocketIo.SOCKET_IO_SERVER_URL + ConfigSocketIo.PORT)); // io.connect(ConfigSocketIo.SOCKET_IO_SERVER_URL + ConfigSocketIo.PORT);
<<<<<<< HEAD
    const url = ConfigSocketIo.SOCKET_IO_SERVER_URL_WS + ":" + ConfigSocketIo.PORT;
    this.webSocketSubject =  webSocket(url);
    this.subscription = this.webSocketSubject.subscribe();
    SocketService.userId = v4();
=======
    // SocketService.userId = v4();
>>>>>>> using-json-rpc-messages
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    for (const receiveId in this.receiveIdObservableMapping) {
      if (this.receiveIdObservableMapping.hasOwnProperty(receiveId)) {
        const receiver = this.receiveIdObservableMapping[receiveId];
        receiver.onDestroy();
      }
    }
    for (const sendId in this.sendIdObservableMapping) {
      if (this.sendIdObservableMapping.hasOwnProperty(sendId)) {
        const sender = this.sendIdObservableMapping[sendId];
        sender.onDestroy();
      }
    }
  }
  // cf. https://github.com/luixaviles/socket-io-typescript-chat/blob/master/client/src/app/shared/socket.service.ts
  // public registerReceive(receiveId: string): Observable<any> {
  //   // return new Observable(observer => {
  //   //   this.socket.on(receiveId, (data: IMessage) => {
  //   //     observer.next(data);
  //   //   });
  //   // });

  //   // https://stackoverflow.com/questions/27748974/rxjs-fromwebsocket-with-socket-io
  //   var dataStream$ = fromEvent(this.socket, receiveId);
  //   // return dataStream$;

  //   // let lastTimeStamp = null;
  //   // dataStream$.pipe(tap(nextValue => {
  //   //   lastTimeStamp = (new Date()).getTime();
  //   // }));

  //   const delayInterval = 5000;
  //   const numberOfRepeats = 3;
  //   // delay by 1000 ms
  //   // https://rxjs.dev/api/operators/delay
  //   const delayedDataStream$ = dataStream$.pipe(delay(delayInterval))

  //   // https://www.learnrxjs.io/learn-rxjs/operators/utility/repeat
  //   const repeatedDataStream$ = delayedDataStream$.pipe(repeat(numberOfRepeats));

  //   // https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttle
  //   // https://rxjs.dev/api/operators/throttle
  //   const throttledDataStream = repeatedDataStream$.pipe(throttle(val => interval(numberOfRepeats*delayInterval + 1)));
  //   return throttledDataStream;

  //   // const throttledDataStream = repeatedDataStream$.pipe(throttleTime((numberOfRepeats*delayInterval + 1), asyncScheduler, {leading: false, trailing: true}), tap(nextValue => {
  //   //   const currentTimeStamp = (new Date()).getTime();
  //   //   console.log(currentTimeStamp - lastTimeStamp);
  //   //   lastTimeStamp = currentTimeStamp;
  //   // }));
  //   // return throttledDataStream;
  // }

<<<<<<< HEAD
  public registerReceive(receiveId: string): Observable<any> {
    const receiver = new SocketIoSubscriptionMappingReceiver(this.webSocketSubject);
    this.receiveIdObservableMapping[receiveId] = receiver;
    return receiver.onReceive(receiveId);
  }

  public registerSend<T extends IMessage>(sendId: string) {
    // sendData.subscribe((data: IMessage) => {
    //   this.socket.emit(sendId, data);
    // });
    const sender = new SocketIoSubscriptionMappingSender(this.webSocketSubject);
    this.sendIdObservableMapping[sendId] = sender;
    return sender.onSend<T>(sendId);
  }
=======
  // public registerReceive(receiveId: string): Observable<any> {
  //   const receiver = new SocketIoSubscriptionMappingReceiver(this.socket);
  //   this.receiveIdObservableMapping[receiveId] = receiver;
  //   return receiver.onReceive(receiveId);
  // }

  // public registerSend<T extends IMessage>(sendId: string) {
  //   // sendData.subscribe((data: IMessage) => {
  //   //   this.socket.emit(sendId, data);
  //   // });
  //   const sender = new SocketIoSubscriptionMappingSender(this.socket);
  //   this.sendIdObservableMapping[sendId] = sender;
  //   return sender.onSend<T>(sendId);
  // }
>>>>>>> using-json-rpc-messages
}
