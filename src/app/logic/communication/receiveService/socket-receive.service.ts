import { GameService } from './../../game/game.service';
import { Injectable, Inject, Injector } from '@angular/core';
import { SocketService, SocketIoSubscriptionMappingReceiver } from '../socketService/socket.service';
import { SocketIoReceiveTypes } from '../../../../../../common/src/communication/socketIoReceiveTypes';
import { IMessage } from '../../../../../../common/src/communication/message/iMessage';
import { ITileCoordinates } from '../../../../../../common/src/tileCoordinates/iTileCoordinates';
import { ICoordinatesMessage } from '../../../../../../common/src/communication/message/iCoordinatesMessage';
import { ITileStateMessage } from '../../../../../../common/src/communication/message/iTileStateMessage';
import { SocketIoSendTypes } from '../../../../../../common/src/communication/socketIoSendTypes';
import { tap } from 'rxjs/operators';
import { WebSocketService } from 'src/app/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class SocketReceiveService {

  constructor(@Inject(SocketService)
  @Inject(WebSocketService)
  private webSocketService: WebSocketService,
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
    // this.init();
  }

  public static debugPrint(msg: any) {
    console.log('userId:' + SocketService.userId);
    console.log(JSON.stringify(msg, null, 4));
  }

  private processMessages(msg: IMessage) {
    switch (msg.type) {
        case SocketIoSendTypes.StartGame:
          this.startGameSuccessResponse(msg);
        break;

        default:
          console.error('unknown-message');
          console.error(JSON.stringify(msg, null, 4));
          break;
    }
  }

  public init() {
    this.webSocketService
    .registerReceive()
    .pipe(tap(this.processMessages.bind(this)))
    .subscribe();


    // this.socketService
    // .registerReceive(SocketIoSendTypes.StartGame)
    // .pipe(tap(this.startGameSuccessResponse.bind(this)))
    // .subscribe();

    // this.socketService
    //   .registerReceive(SocketIoReceiveTypes.BeginningUser)
    //   .pipe(tap(this.beginningUser.bind(this)))
    //   .subscribe();

    // this.socketService
    //   .registerReceive(SocketIoReceiveTypes.Coordinates)
    //   .subscribe(this.coordinates.bind(this));

    // this.socketService
    //   .registerReceive(SocketIoReceiveTypes.TileState)
    //   .subscribe(this.tileState.bind(this));


    // this.socketService
    //   .registerReceive(SocketIoReceiveTypes.RemainingTileState)
    //   .subscribe(this.remainingTileState.bind(this));


    // this.socketService
    //   .registerReceive(SocketIoReceiveTypes.GameWon)
    //   .subscribe(this.gameWon.bind(this));
  }

  private startGameSuccessResponse(jsonrpcMsg: any) {
    console.log(jsonrpcMsg);
    console.log(JSON.stringify(jsonrpcMsg, null, 4));
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
