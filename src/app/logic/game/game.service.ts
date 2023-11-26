import { DisableBlindTilesService } from './../disableBlindTiles/disable-blind-tiles.service';
import { SocketService } from './../communication/socketService/socket.service';
import { Observable, Subject, BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { SocketSendService } from './../communication/sendService/socket-send.service';
import { TileGeneratorService } from './../tileGenerator/tile-generator.service';
import { Injectable, Inject } from '@angular/core';
import { ShipGeneratorService } from '../ship-generator/ship-generator.service';
import { Tile } from '../tile/tile';
import { Ship } from '../ship/ship';
import { ITileCoordinates } from '../../../../../common/src/tileCoordinates/iTileCoordinates';
import { TileState } from '../../../../../common/src/tileState/tileState.enum';
import { TilesHelperService } from '../tiles-helper/tiles-helper.service';
import { GameState } from '../../../../../common/src/gameState/game-state.enum';
import { IMessage } from '../../../../../common/src/communication/message/iMessage';
import { SocketIoSendTypes } from '../../../../../common/src/communication/socketIoSendTypes';
import { HttpClient } from '@angular/common/http';
import { ConfigSocketIo } from '../../../../../common/src/config/configSocketIo';
import { v4 } from 'uuid';
import { webSocket } from 'rxjs/webSocket';

// https://stackoverflow.com/questions/55230263/angular-7-injected-service-is-undefined
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private internalDomesticTiles$: BehaviorSubject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);
  private internalAdversarialTiles$: BehaviorSubject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);
  private internalShips$: BehaviorSubject<Ship[]> = new BehaviorSubject<Ship[]>([]);
  private internalGameState$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(GameState.GameNotStarted);

  private fieldSize: number;
  private shipSizes: number[];

  constructor(
    @Inject(TileGeneratorService)
    private tileGeneratorService: TileGeneratorService,
    @Inject(ShipGeneratorService)
    private shipGeneratorService: ShipGeneratorService,
    //  @Inject(TileTransitionService)
    // private tileTransitionService: TileTransitionService,
    @Inject(SocketSendService)
    private socketSendService: SocketSendService,
    @Inject(DisableBlindTilesService)
    private disableBlindTilesService,
    private httpClient: HttpClient) {
  }

  public initialize(filedSize: number, shipSizes: number[]) {
    this.fieldSize = filedSize;
    this.shipSizes = shipSizes;

    const currentDomesticTiles: Tile[][] = this.tileGeneratorService.generateTiles(
      this.fieldSize,
      true
    );

    const currentAdversarialTiles: Tile[][] = this.tileGeneratorService.generateTiles(
      this.fieldSize,
      false
    );

    const isShipGeneratorSuccessful: boolean = this.shipGeneratorService.generateShips(this.shipSizes, currentDomesticTiles);
    if (isShipGeneratorSuccessful) {
      this.internalGameState$.next(GameState.NotTurn);
      const currentShips = this.shipGeneratorService.ships;
      this.internalShips$.next(currentShips);
      this.internalDomesticTiles$.next(currentDomesticTiles);

      // wait until the 'blind tiles' are disabled ...
      // this.internalAdversarialTiles$.next(currentAdversarialTiles);

      this.disableBlindTilesService.disableBlindTiles(currentAdversarialTiles);
      this.internalAdversarialTiles$.next(currentAdversarialTiles);


      const initWebsocketPromise: Promise<any> = this.initWebsocketConnection();
      initWebsocketPromise.then((response: any) => {
        console.log(JSON.stringify(response, null, 4));
        const connectionPort = response.port;
        // https://rxjs.dev/api/webSocket/webSocket
        const url = ConfigSocketIo.SOCKET_IO_SERVER_URL_WS + ':' + connectionPort;
        const subject = webSocket({url: url, protocol: 'websocket'});
        subject.subscribe({
          next: (message) => {
            console.log(JSON.stringify(message));
          }
        });
        subject.next('ping');

      });
      initWebsocketPromise.catch((error: any) => {
        console.log(JSON.stringify(error, null, 4));
      });


      //this.socketSendService.startGame();
    } else {
      this.internalShips$.next([]);
      this.internalDomesticTiles$.next([]);
      this.internalAdversarialTiles$.next([]);
      this.internalGameState$.next(GameState.InitializationError);

      // alert('initialization error - please, refresh browser-window (F5)');
    }
  }
  initWebsocketConnection(): Promise<any> {
    const userId = SocketService.userId;
    const url = ConfigSocketIo.SOCKET_IO_SERVER_URL + ':' + ConfigSocketIo.PORT + '/' + ConfigSocketIo.API_PATH + '/' + ConfigSocketIo.CONNECTION_PATH;
    return this.httpClient.post(url,
       {
        userId: userId
       }).toPromise();
  }

  public setBeginningUser() {
    this.internalGameState$.next(GameState.Turn);
  }

  public get domesticTiles$(): Observable<Tile[][]> {
    return this.internalDomesticTiles$;
  }

  public get adversarialTiles$(): Observable<Tile[][]> {
    return this.internalAdversarialTiles$;
  }

  public get ships$(): BehaviorSubject<Ship[]> {
    return this.internalShips$;
  }

  public get gameState$(): Observable<GameState> {
    return this.internalGameState$;
  }

  public onFired(coordinates: ITileCoordinates) {
    this.sendCoordinates(coordinates);
  }

  private setDomesticState(coordinates: ITileCoordinates) {
    const currentDomesticTiles: Tile[][] = this.internalDomesticTiles$.value;
    const domesticTile = currentDomesticTiles[coordinates.rowIndex][coordinates.columnIndex];
    const domesticTileState = domesticTile.tileState;
    let newDomesticTileState;
    if (domesticTileState === TileState.Water) {
      newDomesticTileState = TileState.WaterFired;
    }
    if (domesticTileState === TileState.Ship) {
      newDomesticTileState = TileState.ShipFired;
    }
    if (domesticTileState === TileState.ShipFired) {
      newDomesticTileState = TileState.ShipSunken;
    }
    domesticTile.tileState = newDomesticTileState;
  }

  private sendCoordinates(coordinates: ITileCoordinates) {
    // the user has just triggered the sending of coordinates -> so her / his turn ends
    this.internalGameState$.next(GameState.NotTurn);

    // DEBUGGING:
    // console.log(coordinates);
    this.socketSendService.coordinates(coordinates);
  }

  public receiveCoordinates(coordinates: ITileCoordinates) {
    // actions to perform
    this.setDomesticTileState(coordinates);
    this.sinkShipTiles(coordinates);

    // respond to 'game-partner'
    this.sendTileState(coordinates);

    // the incoming coordinates have just been processed -> so its now her / his turn
    this.internalGameState$.next(GameState.Turn);
  }

  private sendTileState(coordinates: ITileCoordinates) {
    const currentDomesticTiles: Tile[][] = this.internalDomesticTiles$.value;
    const updatedDomesticTile: Tile = currentDomesticTiles[coordinates.rowIndex][coordinates.columnIndex];
    this.socketSendService.tileState({
      columnIndex: coordinates.columnIndex,
      rowIndex: coordinates.rowIndex,
      isEndTile: updatedDomesticTile.isEndTile,
      isHorizontal: false, // TODO: FIXME: how is this state used and how is it possible to set it (e.g. from the ship-data)
      isStartTile: updatedDomesticTile.isStartTile,
      tileState: updatedDomesticTile.tileState
    });
  }

  private sinkShipTiles(coordinates: ITileCoordinates) {
    const currentDomesticTiles: Tile[][] = this.internalDomesticTiles$.value;
    const shipIndex: number = TilesHelperService
      .isShipSunken(coordinates.rowIndex,
        coordinates.columnIndex,
        currentDomesticTiles,
        this.internalShips$.value);
    // let newDomesticTileState: TileState = null;
    if (shipIndex !== -1) {
      const ship: Ship = this.internalShips$.value[shipIndex];
      ship.isSunken = true;

      const firstRowIndex = ship.rowIndex;
      const firstColumnIndex = ship.columnIndex;

      for (let i = 0; i < ship.size; i++) {
        let currentShipTileCoordinates: ITileCoordinates = null;
        if (ship.horizontal) {
          currentShipTileCoordinates = {
            rowIndex: firstRowIndex,
            columnIndex: firstColumnIndex + i
          };
        } else {
          currentShipTileCoordinates = {
            rowIndex: firstRowIndex + i,
            columnIndex: firstColumnIndex
          };
        }
        this.setDomesticState(currentShipTileCoordinates);
        // send-sunken-ship-tile
        this.sendTileState(currentShipTileCoordinates);
      }
      // check-if-game-partner has just won, i.e. whether this user has just lost the game
      this.sendGameWonIfNecessary();
      // the state(s) have just been changed -> flush it to the UI
      this.internalDomesticTiles$.next(currentDomesticTiles);
    }
  }

  private sendRemainingShipTileStates() {
    const domesticTiles: Tile[][] = this.internalDomesticTiles$.value;
    const length: number = domesticTiles.length;

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const tile: Tile = domesticTiles[i][j];
        if (tile.tileState === TileState.Ship) {
          this.sendTileState({
            rowIndex: i,
            columnIndex: j
          });
        }
      }
    }
  }


  private isGameLost() {
    let allShipsSunken = true;
    const ships: Ship[] = this.internalShips$.value;
    ships.forEach((ship) => {
      if (!ship.isSunken) {
        allShipsSunken = false;
      }
    });
    return allShipsSunken;
  }

  private sendGameWonIfNecessary() {
    const isGameLost: boolean = this.isGameLost();
    if (isGameLost) {
      this.internalGameState$.next(GameState.GameLost);
      this.socketSendService.gameWon();
    }
  }

  private setDomesticTileState(coordinates: ITileCoordinates) {
    const currentDomesticTiles: Tile[][] = this.internalDomesticTiles$.value;
    const domesticTile = currentDomesticTiles[coordinates.rowIndex][coordinates.columnIndex];
    const domesticTileState = domesticTile.tileState;
    let newDomesticTileState;
    if (domesticTileState === TileState.Water) {
      newDomesticTileState = TileState.WaterFired;
    }
    if (domesticTileState === TileState.Ship) {
      newDomesticTileState = TileState.ShipFired;
    }
    if (domesticTileState === TileState.ShipFired) {
      newDomesticTileState = TileState.ShipSunken;
    }
    domesticTile.tileState = newDomesticTileState;

    // flush it as the state has just changed
    this.internalDomesticTiles$.next(currentDomesticTiles);
  }

  public receiveTileState(coordinates: ITileCoordinates, tileState: TileState) {
    const currentAdversarialTiles: Tile[][] = this.internalAdversarialTiles$.value;
    const adversarialTile: Tile = currentAdversarialTiles[coordinates.rowIndex][coordinates.columnIndex];

    // TODO: FIXME: implement
    // adversarialTile.isStartTile = false;
    // adversarialTile.isEndTile = false;
    // adversarialTile.isHorizontal = false;

    // DEBUGGING:
    console.log('receiving (adversarial) tile state:' + JSON.stringify(coordinates, null, 4) + ':' + tileState);

    adversarialTile.tileState = tileState;

    // flush it as the state has just been changed
    this.internalAdversarialTiles$.next(currentAdversarialTiles);
  }

  public receiveGameWon() {
    this.internalGameState$.next(GameState.GameWon);
    this.sendRemainingShipTileStates();
  }
}
