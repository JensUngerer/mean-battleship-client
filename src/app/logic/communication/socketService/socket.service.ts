import { Injectable, OnDestroy } from '@angular/core';
import  io from 'socket.io-client';
import { ConfigSocketIo } from './../../../../../../common/src/config/configSocketIo';
import { v4 } from 'uuid';
import { IMessage } from './../../../../../../common/src/communication/message/iMessage';
import { Observable, interval, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { fromEvent, asyncScheduler } from 'rxjs';
import { throttle, delay, repeat, throttleTime, tap } from 'rxjs/operators';
import { SocketIoReceiveTypes } from '../../../../../../common/src/communication/socketIoReceiveTypes';

export class SocketIoSubscriptionMappingSender {
  private sendId: string;
  private send$: ReplaySubject<any>;
  private sendSubscription: Subscription;

  private onSendId<T extends IMessage>(data: T) {
    this.socket.emit(this.sendId, data);
  }

  constructor(private socket: any) {
  }

  onSend<T extends IMessage>(sendId: string) {
    this.send$ = new ReplaySubject<any>();
    this.sendId = sendId;
    this.sendSubscription = this.send$.pipe(tap(this.onSendId.bind(this))).subscribe();
    return this.send$;
  }

  onDestroy() {
    if (this.sendSubscription) {
      this.sendSubscription.unsubscribe();
    }
  }

}

export class SocketIoSubscriptionMappingReceiver {
  static INITIAL_VALUE: IMessage = {
    sourceUserId: '',
    type: SocketIoReceiveTypes.InitialValue
  };

  private receiver$: BehaviorSubject<any>;

  private registeredReceiveId: string;


  private onReceiveId(data: IMessage) {
    this.receiver$.next(data);
  }

  constructor(private socket: any) {
  }

  onReceive(receiveId: string) {
    this.receiver$ = new BehaviorSubject<any>(SocketIoSubscriptionMappingReceiver.INITIAL_VALUE);

    this.socket.on(receiveId, this.onReceiveId.bind(this));

    this.registeredReceiveId = receiveId;

    return this.receiver$;
  }

  onDestroy() {
    this.socket.removeListener(this.registeredReceiveId, this.onReceiveId.bind(this));
  }
}

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  public static userId: string;
  private socket: any;
  private receiveIdObservableMapping: { [key: string]: SocketIoSubscriptionMappingReceiver } = {};
  private sendIdObservableMapping: { [key: string]: SocketIoSubscriptionMappingSender } = {};


  constructor() {
    this.socket = io((ConfigSocketIo.SOCKET_IO_SERVER_URL + ConfigSocketIo.PORT)); // io.connect(ConfigSocketIo.SOCKET_IO_SERVER_URL + ConfigSocketIo.PORT);
    SocketService.userId = v4();
  }

  ngOnDestroy(): void {
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

  public registerReceive(receiveId: string): Observable<any> {
    const receiver = new SocketIoSubscriptionMappingReceiver(this.socket);
    this.receiveIdObservableMapping[receiveId] = receiver;
    return receiver.onReceive(receiveId);
  }

  public registerSend<T extends IMessage>(sendId: string) {
    // sendData.subscribe((data: IMessage) => {
    //   this.socket.emit(sendId, data);
    // });
    const sender = new SocketIoSubscriptionMappingSender(this.socket);
    this.sendIdObservableMapping[sendId] = sender;
    return sender.onSend<T>(sendId);
  }
}
