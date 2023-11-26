import { SocketService } from './../socketService/socket.service';
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ICoordinatesMessage } from './../../../../../../common/src/communication/message/iCoordinatesMessage';
import { ITileStateMessage } from './../../../../../../common/src/communication/message/iTileStateMessage';
import { SocketIoSendTypes } from '../../../../../../common/src/communication/socketIoSendTypes';
import { IMessage } from '../../../../../../common/src/communication/message/iMessage';
import { ITileCoordinates } from '../../../../../../common/src/tileCoordinates/iTileCoordinates';
import { IDomesticTileState } from './../../../../../../common/src/domesticTileState/iDomesticTileState';
import { WebSocketService } from 'src/app/web-socket.service';
import { ICommunicationContainer } from './../../../../../../common/src/communication/message/iCommunicationContainer';
import { CommunicationType } from '../../../../../../common/src/communication/communicationType';
import jsonrpc from 'jsonrpc-lite';
import { CommunicationMethod } from '../../../../../../common/src/communication/communicationMethod';
import { v4 } from 'uuid';
import { ICoordinatesContainer } from '../../../../../../common/src/communication/message/iCoordinatesContainer';
import { ITileStateContainer } from '../../../../../../common/src/communication/message/ITileStateContainer';

@Injectable({
  providedIn: 'root'
})
export class SocketSendService {
  // private startGame$: Subject<IMessage> = null;//new Subject<IMessage>();
  // private coordinates$: Subject<ICoordinatesMessage> = null;//new Subject<ICoordinatesMessage>();
  // private tileState$: Subject<ITileStateMessage> = null;//new Subject<ITileStateMessage>();
  // private remainingTileState$: Subject<ITileStateMessage> = null;// new Subject<ITileStateMessage>();
  // private gameWon$: Subject<IMessage> = null; // new Subject<IMessage>();

  private webSocketSubject : Subject<any>;
  constructor() {
    // this.init();
  }

  public init(webSocketSubject: Subject<any>) {
    this.webSocketSubject = webSocketSubject;
  //   this.startGame$ = this.socketService.registerSend<IMessage>(SocketIoSendTypes.StartGame);
  //   this.coordinates$ = this.socketService.registerSend<ICoordinatesMessage>(SocketIoSendTypes.Coordinates);
  //   this.tileState$ = this.socketService.registerSend<ITileStateMessage>(SocketIoSendTypes.TileState);
  //   this.remainingTileState$ = this.socketService.registerSend<ITileStateMessage>(SocketIoSendTypes.RemainingTileState);
  //   this.gameWon$ = this.socketService.registerSend<IMessage>(SocketIoSendTypes.GameWon);
  }

  public startGame() {
    // const msg: IMessage = {
    //   type: SocketIoSendTypes.StartGame,
    //   sourceUserId: WebSocketService.userId
    // };
    const container : ICommunicationContainer = {
      type: CommunicationType.AddUser,
      sourceUserId: WebSocketService.userId,
    };
    const msg = jsonrpc.request(v4(), CommunicationMethod.Post, container);
    if (!this.webSocketSubject) {
      console.error('cannot start game');
      return;
    }
    this.webSocketSubject?.next(msg.serialize());
  }

  public coordinates(coordinates: ITileCoordinates) {
    // const msg: ICoordinatesMessage = {
    //   type: SocketIoSendTypes.Coordinates,
    //   sourceUserId: WebSocketService.userId,
    //   coordinates: {
    //     rowIndex: coordinates.rowIndex,
    //     columnIndex: coordinates.columnIndex
    //   }
    // };
    const container : ICoordinatesContainer = {
      type: CommunicationType.Coordinates,
      sourceUserId: WebSocketService.userId,
      coordinates: {
        rowIndex: coordinates.rowIndex,
        columnIndex: coordinates.columnIndex
      }
    };
    const msg = jsonrpc.request(v4(), CommunicationMethod.Post, container);
    this.webSocketSubject?.next(msg.serialize());
  }

  public tileState(newDomesticTileState: IDomesticTileState) {
    // const msg: ITileStateMessage = {
    //   type: SocketIoSendTypes.TileState,
    //   sourceUserId: WebSocketService.userId,
    //   coordinates: {
    //     rowIndex: newDomesticTileState.rowIndex,
    //     columnIndex: newDomesticTileState.columnIndex
    //   },
    //   tileState: newDomesticTileState.tileState,
    //   isStartTile: newDomesticTileState.isStartTile,
    //   isEndTile: newDomesticTileState.isEndTile,
    //   isHorizontal: newDomesticTileState.isHorizontal
    // };
    const container : ITileStateContainer = {
      type: CommunicationType.TileState,
      sourceUserId: WebSocketService.userId,
      coordinates: {
        rowIndex: newDomesticTileState.rowIndex,
        columnIndex: newDomesticTileState.columnIndex
      },
      tileState: newDomesticTileState.tileState,
      isStartTile: newDomesticTileState.isStartTile,
      isEndTile: newDomesticTileState.isEndTile,
      isHorizontal: newDomesticTileState.isHorizontal
    };
    const msg = jsonrpc.request(v4(), CommunicationMethod.Post, container);
    this.webSocketSubject?.next(msg.serialize());
  }

  // public remainingTileState(msg: ITileStateMessage) {
  //   // const msg: ITileStateMessage = {
  //   //   type: action.type,
  //   //   sourceUserId: CommunicationWebSocketService.userId,
  //   //   coordinates: {
  //   //     rowIndex: action.payload.rowIndex,
  //   //     columnIndex: action.payload.columnIndex
  //   //   },
  //   //   tileState: action.payload.tileState,
  //   // };
  //   this.webSocketSubject?.next(msg);
  // }

  public gameWon() {
    // const msg: IMessage = {
    //   sourceUserId: WebSocketService.userId,
    //   type: SocketIoSendTypes.GameWon
    // };
    const container : ICommunicationContainer = {
      type: CommunicationType.GameWon,
      sourceUserId: WebSocketService.userId,
    };
    const msg = jsonrpc.request(v4(), CommunicationMethod.Post, container);
    this.webSocketSubject?.next(msg.serialize());
  }
}
