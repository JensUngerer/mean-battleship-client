import { SocketService } from './../socketService/socket.service';
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ICoordinatesMessage } from './../../../../../../common/src/communication/message/iCoordinatesMessage';
import { ITileStateMessage } from './../../../../../../common/src/communication/message/iTileStateMessage';
import { SocketIoSendTypes } from '../../../../../../common/src/communication/socketIoSendTypes';
import { IMessage } from '../../../../../../common/src/communication/message/iMessage';


@Injectable({
  providedIn: 'root'
})
export class SocketSendService {
  private coordinates$: Subject<any> = new Subject<any>();
  private tileState$: Subject<any> = new Subject<any>();
  private remainingTileState$: Subject<any> = new Subject<any>();
  private gameWon$: Subject<any> = new Subject<any>();

  constructor(@Inject(SocketService) private socketService: SocketService) {
    this.init();
  }

  private init() {
    this.socketService.registerSend(SocketIoSendTypes.Coordinates, this.coordinates$);
    this.socketService.registerSend(SocketIoSendTypes.TileState, this.tileState$);
    this.socketService.registerSend(SocketIoSendTypes.RemainingTileState, this.remainingTileState$);
    this.socketService.registerSend(SocketIoSendTypes.GameWon, this.gameWon$);
  }

  private coordinates(msg: ICoordinatesMessage) {
    // const msg: ICoordinatesMessage = {
    //   coordinates: {
    //     rowIndex: 0
    //     columnIndex: 0
    //   }
    // };
    this.coordinates$.next(msg);
  }

  private tileState(msg: ITileStateMessage) {
    // const msg: ITileStateMessage = {
    //   type: action.type,
    //   sourceUserId: CommunicationSocketService.userId,
    //   coordinates: {
    //     rowIndex: action.payload.rowIndex,
    //     columnIndex: action.payload.columnIndex
    //   },
    //   tileState: action.payload.tile.tileState,
    //   isStartTile: action.payload.tile.isStartTile,
    //   isEndTile: action.payload.tile.isEndTile,
    //   isHorizontal: action.payload.isHorizontal
    // };
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
