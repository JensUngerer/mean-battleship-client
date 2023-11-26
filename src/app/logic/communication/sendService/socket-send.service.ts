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
    const msg: IMessage = {
      type: SocketIoSendTypes.StartGame,
      sourceUserId: WebSocketService.userId
    };
    if (!this.webSocketSubject) {
      console.error('cannot start game');
      return;
    }
    this.webSocketSubject?.next(msg);
  }

  public coordinates(coordinates: ITileCoordinates) {
    const msg: ICoordinatesMessage = {
      type: SocketIoSendTypes.Coordinates,
      sourceUserId: WebSocketService.userId,
      coordinates: {
        rowIndex: coordinates.rowIndex,
        columnIndex: coordinates.columnIndex
      }
    };
    this.webSocketSubject?.next(msg);
  }

  public tileState(newDomesticTileState: IDomesticTileState) {
    const msg: ITileStateMessage = {
      type: SocketIoSendTypes.TileState,
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
    this.webSocketSubject?.next(msg);
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
    const msg: IMessage = {
      sourceUserId: WebSocketService.userId,
      type: SocketIoSendTypes.GameWon
    };
    this.webSocketSubject?.next(msg);
  }
}
