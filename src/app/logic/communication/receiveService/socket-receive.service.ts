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
import { ICommunicationContainer } from '../../../../../../common/src/communication/message/iCommunicationContainer';
import { CommunicationType } from '../../../../../../common/src/communication/communicationType';
import jsonrpc, { IParsedObject, RequestObject, SuccessObject } from 'jsonrpc-lite';
import { ITileStateContainer } from '../../../../../../common/src/communication/message/ITileStateContainer';
import { ICoordinatesContainer } from '../../../../../../common/src/communication/message/iCoordinatesContainer';
import { CommunicationMethod } from '../../../../../../common/src/communication/communicationMethod';

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
    console.log('userId:' + WebSocketService.userId);
    console.log(JSON.stringify(msg, null, 4));
  }

  private processMessages(msg: any) {
    // const parsedMsg = JSON.parse(msg);
    const jsonRpcParsed = jsonrpc.parseObject(msg) as IParsedObject;;
    if (jsonRpcParsed.type === 'invalid') {
      console.error('incoming message is not a valid JSON-RPC - message');
      return;
    }
    if (jsonRpcParsed.type === 'success') {
      console.log('success:' + JSON.stringify(jsonRpcParsed, null, 4));
      return;
    }
    const requestObject = jsonRpcParsed.payload as RequestObject;
    const incomingMessage = requestObject.params as ICommunicationContainer;

    // ACK
    const successResponse = jsonrpc.success(requestObject.id, CommunicationMethod.PostAck) as SuccessObject;
    this.webSocketService.send(successResponse);

    switch (incomingMessage.type) {
      case CommunicationType.AddUser:
        this.startGameSuccessResponse(incomingMessage);
        break;
      case CommunicationType.BeginningUser:
        this.beginningUser(incomingMessage);
        break;
      case CommunicationType.Coordinates:
        const castedMsg: ICoordinatesContainer = incomingMessage as ICoordinatesContainer;
        this.coordinates(castedMsg);
        break;
      case CommunicationType.TileState:
        const casteTileStatedMsg: ITileStateContainer = incomingMessage as ITileStateContainer;
        this.tileState(casteTileStatedMsg);
        break;
      case CommunicationType.RemainingTileState:
        // this.remainingTileState(container);
        console.error('unknown logic:' + incomingMessage.type);
        break;
      case CommunicationType.GameWon:
        this.gameWon(incomingMessage);
        break;
      case CommunicationType.GameLost:
        this.gameLost(incomingMessage);
        break;
      default:
        console.error('unknown-message');
        console.error(JSON.stringify(incomingMessage, null, 4));
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


  gameLost(msg: ICommunicationContainer) {
    this.gameService.receiveGameLost();
  }


  private startGameSuccessResponse(jsonrpcMsg: any) {
    console.log(jsonrpcMsg);
    console.log(JSON.stringify(jsonrpcMsg, null, 4));
  }

  private beginningUser(msg: ICommunicationContainer) {
    // SocketReceiveService.debugPrint(msg);

    this.gameService.setBeginningUser();
  }

  private coordinates(msg: ICoordinatesContainer) {
    // if (msg.type === SocketIoReceiveTypes.InitialValue) {
    //   return;
    // }

    // SocketReceiveService.debugPrint(msg);

    const coordinates: ITileCoordinates = {
      rowIndex: msg.coordinates.rowIndex,
      columnIndex: msg.coordinates.columnIndex
    };

    this.gameService.receiveCoordinates(coordinates);
  }

  private tileState(msg: ITileStateContainer) {
    // DEBUGGING:
    // SocketReceiveService.debugPrint(msg);

    const coordinates: ITileCoordinates = {
      rowIndex: msg.coordinates.rowIndex,
      columnIndex: msg.coordinates.columnIndex
    };
    this.gameService.receiveTileState(coordinates, msg.tileState);
  }

  private gameWon(msg: any) {
    // SocketReceiveService.debugPrint(msg);

    this.gameService.receiveGameWon();
  }
}
