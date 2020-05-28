import { GameService } from './../../game/game.service';
import { Injectable, Inject, Injector } from '@angular/core';
import { SocketService, SocketIoSubscriptionMappingReceiver } from '../socketService/socket.service';
import { SocketIoReceiveTypes } from '../../../../../../common/src/communication/socketIoReceiveTypes';
import { IMessage } from '../../../../../../common/src/communication/message/iMessage';
import { ITileCoordinates } from '../../../../../../common/src/tileCoordinates/iTileCoordinates';
import { ICoordinatesMessage } from '../../../../../../common/src/communication/message/iCoordinatesMessage';
import { ITileStateMessage } from '../../../../../../common/src/communication/message/iTileStateMessage';

@Injectable({
  providedIn: 'root'
})
export class SocketReceiveService {

  constructor(@Inject(SocketService)
  private socketService: SocketService,
    @Inject(GameService)
    private gameService: GameService) {

    // // const injector = Injector.create({
    // //   providers: [{
    // //     provide: GameService,
    // //     deps: [5, [1, 2]],
    // //     multi: false
    // //   }]
    // // });
    // const injector = Injector.create({
    //   providers: [{
    //     provide: GameService,
    //     deps: [Number, Array, TileGeneratorService, ShipGeneratorService, SocketSendService],
    //     multi: false
    //   }]
    // });
    // const gameService: GameService = injector.get(GameService);
    // this.gameService = gameService;
    this.init();
  }

  public static debugPrint(msg: any) {
    console.log('userId:' + SocketService.userId);
    console.log(JSON.stringify(msg, null, 4));
  }

  private init() {
    this.socketService
      .registerReceive(SocketIoReceiveTypes.BeginningUser)
      .subscribe(this.beginningUser.bind(this));

    this.socketService
      .registerReceive(SocketIoReceiveTypes.Coordinates)
      .subscribe(this.coordinates.bind(this));

    this.socketService
      .registerReceive(SocketIoReceiveTypes.TileState)
      .subscribe(this.tileState.bind(this));


    this.socketService
      .registerReceive(SocketIoReceiveTypes.RemainingTileState)
      .subscribe(this.remainingTileState.bind(this));


    this.socketService
      .registerReceive(SocketIoReceiveTypes.GameWon)
      .subscribe(this.gameWon.bind(this));
  }

  private beginningUser(msg: IMessage) {
    if (msg.type === SocketIoReceiveTypes.InitialValue) {
      return;
    }
    SocketReceiveService.debugPrint(msg);

    this.gameService.setBeginningUser();
  }

  private coordinates(msg: ICoordinatesMessage) {
    if (msg.type === SocketIoReceiveTypes.InitialValue) {
      return;
    }

    SocketReceiveService.debugPrint(msg);

    const coordinates: ITileCoordinates = {
      rowIndex: msg.coordinates.rowIndex,
      columnIndex: msg.coordinates.columnIndex
    };

    this.gameService.receiveCoordinates(coordinates);
  }

  private tileState(msg: ITileStateMessage) {
    if (msg.type === SocketIoReceiveTypes.InitialValue) {
      return;
    }

    // DEBUGGING:
    SocketReceiveService.debugPrint(msg);

    const coordinates: ITileCoordinates = {
      rowIndex: msg.coordinates.rowIndex,
      columnIndex: msg.coordinates.columnIndex
    };
    this.gameService.receiveTileState(coordinates, msg.tileState);
  }

  private remainingTileState(msg: any) {
    if (msg.type === SocketIoReceiveTypes.InitialValue) {
      return;
    }

    SocketReceiveService.debugPrint(msg);

    // TODO: why is there no logic?
  }

  private gameWon(msg: any) {
    if (msg.type === SocketIoReceiveTypes.InitialValue) {
      return;
    }

    SocketReceiveService.debugPrint(msg);

    this.gameService.receiveGameWon();
  }
}
