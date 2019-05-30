import { Game } from 'src/app/logic/game/game';
import { Injectable, Inject } from '@angular/core';
import { SocketService } from '../socketService/socket.service';
import { SocketIoReceiveTypes } from '../../../../../../common/src/communication/socketIoReceiveTypes';
import { IMessage } from '../../../../../../common/src/communication/message/iMessage';
import { ITileCoordinates } from '../../../../../../common/src/tileCoordinates/iTileCoordinates';
import { ICoordinatesMessage } from '../../../../../../common/src/communication/message/iCoordinatesMessage';
import { ITileStateMessage } from '../../../../../../common/src/communication/message/iTileStateMessage';

@Injectable({
  providedIn: 'root'
})
export class SocketReceiveService {

  private static internalGame: Game;

  constructor(@Inject(SocketService) private socketService: SocketService) {
    this.init();
  }

  public static debugPrint(msg: any) {
    console.log('userId:' + SocketService.userId);
    console.log(JSON.stringify(msg, null, 4));
  }

  public set game(game: Game) {
    SocketReceiveService.internalGame = game;
  }

  private init() {
    this.socketService
      .registerReceive(SocketIoReceiveTypes.BeginningUser)
      .subscribe(this.beginningUser);

    this.socketService
      .registerReceive(SocketIoReceiveTypes.Coordinates)
      .subscribe(this.coordinates);

    this.socketService
      .registerReceive(SocketIoReceiveTypes.TileState)
      .subscribe(this.tileState);


    this.socketService
      .registerReceive(SocketIoReceiveTypes.RemainingTileState)
      .subscribe(this.remainingTileState);


    this.socketService
      .registerReceive(SocketIoReceiveTypes.GameWon)
      .subscribe(this.gameWon);
  }

  private beginningUser(msg: IMessage) {
    SocketReceiveService.debugPrint(msg);
  }

  private coordinates(msg: ICoordinatesMessage) {
    SocketReceiveService.debugPrint(msg);

    const coordinates: ITileCoordinates = {
      rowIndex: msg.coordinates.rowIndex,
      columnIndex: msg.coordinates.columnIndex
    };

    SocketReceiveService.internalGame.receiveCoordinates(coordinates);
  }

  private tileState(msg: ITileStateMessage) {
    // DEBUGGING:
    // SocketReceiveService.debugPrint(msg);

    const coordinates: ITileCoordinates =  {
      rowIndex: msg.coordinates.rowIndex,
      columnIndex: msg.coordinates.columnIndex
    };
    SocketReceiveService.internalGame.receiveTileState(coordinates, msg.tileState);

  }

  private remainingTileState(msg: any) {
    SocketReceiveService.debugPrint(msg);
  }

  private gameWon(msg: any) {
    SocketReceiveService.debugPrint(msg);
  }
}
