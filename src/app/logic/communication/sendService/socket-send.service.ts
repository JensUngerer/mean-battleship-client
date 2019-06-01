import { SocketService } from './../socketService/socket.service';
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ICoordinatesMessage } from './../../../../../../common/src/communication/message/iCoordinatesMessage';
import { ITileStateMessage } from './../../../../../../common/src/communication/message/iTileStateMessage';
import { SocketIoSendTypes } from '../../../../../../common/src/communication/socketIoSendTypes';
import { IMessage } from '../../../../../../common/src/communication/message/iMessage';
import { ITileCoordinates } from '../../../../../../common/src/tileCoordinates/iTileCoordinates';
import { IDomesticTileState } from './../../../../../../common/src/domesticTileState/iDomesticTileState';

@Injectable({
  providedIn: 'root'
})
export class SocketSendService {
  private startGame$: Subject<IMessage> = new Subject<IMessage>();
  private coordinates$: Subject<ICoordinatesMessage> = new Subject<ICoordinatesMessage>();
  private tileState$: Subject<any> = new Subject<any>();
  private remainingTileState$: Subject<any> = new Subject<any>();
  private gameWon$: Subject<any> = new Subject<any>();

  constructor(@Inject(SocketService) private socketService: SocketService) {
    this.init();
  }

  private init() {
    this.socketService.registerSend<IMessage>(SocketIoSendTypes.StartGame, this.startGame$);
    this.socketService.registerSend<ICoordinatesMessage>(SocketIoSendTypes.Coordinates, this.coordinates$);
    this.socketService.registerSend<ITileStateMessage>(SocketIoSendTypes.TileState, this.tileState$);
    this.socketService.registerSend<ITileStateMessage>(SocketIoSendTypes.RemainingTileState, this.remainingTileState$);
    this.socketService.registerSend<IMessage>(SocketIoSendTypes.GameWon, this.gameWon$);
  }

  public startGame() {
    const msg: IMessage = {
      type: SocketIoSendTypes.StartGame,
      sourceUserId: SocketService.userId
    };
    this.startGame$.next(msg);
  }

  public coordinates(coordinates: ITileCoordinates) {
    const msg: ICoordinatesMessage = {
      type: SocketIoSendTypes.Coordinates,
      sourceUserId: SocketService.userId,
      coordinates: {
        rowIndex: coordinates.rowIndex,
        columnIndex: coordinates.columnIndex
      }
    };
    this.coordinates$.next(msg);
  }

  public tileState(newDomesticTileState: IDomesticTileState) {
    const msg: ITileStateMessage = {
      type: SocketIoSendTypes.TileState,
      sourceUserId: SocketService.userId,
      coordinates: {
        rowIndex: newDomesticTileState.rowIndex,
        columnIndex: newDomesticTileState.columnIndex
      },
      tileState: newDomesticTileState.tileState,
      isStartTile: newDomesticTileState.isStartTile,
      isEndTile: newDomesticTileState.isEndTile,
      isHorizontal: newDomesticTileState.isHorizontal
    };
    this.tileState$.next(msg);
  }

  public remainingTileState(msg: ITileStateMessage) {
    // const msg: ITileStateMessage = {
    //   type: action.type,
    //   sourceUserId: CommunicationSocketService.userId,
    //   coordinates: {
    //     rowIndex: action.payload.rowIndex,
    //     columnIndex: action.payload.columnIndex
    //   },
    //   tileState: action.payload.tileState,
    // };
    this.remainingTileState$.next(msg);
  }

  public gameWon(msg: IMessage) {
    // const msg: IMessage = {
    //   type: CommunicationSendTypes.GameWon,
    //   sourceUserId: CommunicationSocketService.userId,
    // };
    this.gameWon$.next(msg);
  }
}
