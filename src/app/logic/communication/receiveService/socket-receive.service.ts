import { Injectable, Inject } from '@angular/core';
import { SocketService } from '../socketService/socket.service';
import { SocketIoReceiveTypes } from '../../../../../../common/src/communication/socketIoReceiveTypes';

@Injectable({
  providedIn: 'root'
})
export class SocketReceiveService {

  constructor(@Inject(SocketService) private socketService: SocketService) {
    this.init();
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

  private beginningUser(msg: any) {
    this.debugPrint(msg);
  }

  private coordinates(msg: any) {
    this.debugPrint(msg);
  }

  private tileState(msg: any) {
    this.debugPrint(msg);
  }

  private remainingTileState(msg: any) {
    this.debugPrint(msg);
  }

  private gameWon(msg: any) {
    this.debugPrint(msg);
  }

  private debugPrint(msg: any) {
    console.log(JSON.stringify(msg, null, 4));
  }
}
