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

// https://stackoverflow.com/questions/55230263/angular-7-injected-service-is-undefined
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private $internalDomesticTiles: BehaviorSubject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);
  private $internalAdversarialTiles: BehaviorSubject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);

  // private currentDomesticTiles: Tile[][] = [];
  // private currentAdversarialTiles: Tile[][] = [];
  private $internalShips: BehaviorSubject<Ship[]> = new BehaviorSubject<Ship[]>([]);
  // private currentShips: Ship[] = [];

  private fieldSize: number;
  private shipSizes: number[];

  constructor(
    @Inject(TileGeneratorService)
    private tileGeneratorService: TileGeneratorService,
    @Inject(ShipGeneratorService)
    private shipGeneratorService: ShipGeneratorService,
    @Inject(SocketSendService)
    private socketSendService: SocketSendService) {
  }

  public initialize(filedSize: number, shipSizes: number[]) {
    this.fieldSize = filedSize;
    this.shipSizes = shipSizes;

    const currentDomesticTiles: Tile[][] = this.tileGeneratorService.generateTiles(
      this.fieldSize,
      true
    );
    // is done after ship generation
    // this.$internalDomesticTiles.next(currentDomesticTiles);

    const currentAdversarialTiles: Tile[][] = this.tileGeneratorService.generateTiles(
      this.fieldSize,
      false
    );

    const isShipGeneratorSuccessful: boolean = this.shipGeneratorService.generateShips(this.shipSizes, currentDomesticTiles);
    if (isShipGeneratorSuccessful) {
      const currentShips = this.shipGeneratorService.ships;
      this.$internalShips.next(currentShips);
      this.$internalDomesticTiles.next(currentDomesticTiles);
      this.$internalAdversarialTiles.next(currentAdversarialTiles);
    } else {
      this.$internalShips.next([]);
      this.$internalDomesticTiles.next([]);
      this.$internalAdversarialTiles.next([]);
    }

    // current must contain the currently ('flushed') data
    // this.$internalDomesticTiles.subscribe((tiles: Tile[][]) => {
    //   this.currentDomesticTiles = tiles;
    // });
    // this.$internalAdversarialTiles.subscribe((tiles: Tile[][]) => {
    //   this.currentAdversarialTiles = tiles;
    // });

    // let subscriber: Subscription = null;
    // const setInitiallyShipsOnDomesticTiles: (domesticTiles: Tile[][]) => void = ;
    // const subscription: Subscription = this.$internalDomesticTiles.subscribe((domesticTiles: Tile[][]) => {
    //   // no matter what happens -> unregister setting of ships
    //   // this.$internalDomesticTiles.unsubscribe();
    //   // if (subscription) {
    //   //   subscription.unsubscribe();
    //   // } else {
    //   //   console.error('no Subscription object');
    //   // }
    // });

    // this.$internalAdversarialTiles.subscribe((adversarialTiles: Tile[][]) => {
    //   this.currentAdversarialTiles = adversarialTiles;
    // });
  }

  public get domesticTiles(): Observable<Tile[][]> {
    return this.$internalDomesticTiles;
  }

  public get adversarialTiles(): Observable<Tile[][]> {
    return this.$internalAdversarialTiles;
  }

  public get ships(): BehaviorSubject<Ship[]> {
    return this.$internalShips;
  }

  public onFired(coordinates: ITileCoordinates) {
    // DEBUGGING:
    // console.log(coordinates);

    // only for DEBUGGING purposes
    // this.receiveCoordinates(coordinates);


    // this.setDomesticTileState(coordinates);
    this.sendCoordinates(coordinates);

    // as a kind of response the adversarial tile-state has to be set...
    // this.setAdversarialTileState()
  }

  private setDomesticState(coordinates: ITileCoordinates) {
    // this.tileActions.receiveCoordinates(coordinates);

    // DEBUGGING:
    // console.log('Game-class');
    // console.log(coordinates);

    // 1)
    const currentDomesticTiles: Tile[][] = this.$internalDomesticTiles.value;
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

    // 2)
    this.socketSendService.tileState({
      rowIndex: coordinates.rowIndex,
      columnIndex: coordinates.columnIndex,
      isEndTile: false, // TODO: these flags are used for visualization only? -> implement!
      isHorizontal: false,
      isStartTile: false,
      tileState: newDomesticTileState
    });
  }

  private sendCoordinates(coordinates: ITileCoordinates) {
    // DEBUGGING:
    // console.log(coordinates);
    this.socketSendService.coordinates(coordinates);
  }

  public receiveCoordinates(coordinates: ITileCoordinates) {
    this.setDomesticTileState(coordinates);
    this.sinkShipTiles(coordinates);
  }

  private sinkShipTiles(coordinates: ITileCoordinates) {
    const currentDomesticTiles: Tile[][] = this.$internalDomesticTiles.value;
    const shipIndex: number = TilesHelperService
      .isShipSunken(coordinates.rowIndex,
        coordinates.columnIndex,
        currentDomesticTiles,
        this.$internalShips.value);
    // let newDomesticTileState: TileState = null;
    if (shipIndex !== -1) {
      const ship: Ship = this.$internalShips.value[shipIndex];
      ship.isSunken = true;

      const firstRowIndex = ship.rowIndex;
      const firstColumnIndex = ship.columnIndex;

      for (let i = 0; i < ship.size; i++) {
        if (ship.horizontal) {
          this.setDomesticState({
            rowIndex: firstRowIndex,
            columnIndex: firstColumnIndex + i
          })
        } else {
          this.setDomesticState({
            rowIndex: firstRowIndex + i,
            columnIndex: firstColumnIndex
          });
        }
        // the state has changed -> flush it to the UI
        this.$internalDomesticTiles.next(currentDomesticTiles);
      }
    }
  }

  private setDomesticTileState(coordinates: ITileCoordinates) {
    const currentDomesticTiles: Tile[][] = this.$internalDomesticTiles.value;
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
    this.$internalDomesticTiles.next(currentDomesticTiles);
  }

  public receiveTileState(coordinates: ITileCoordinates, tileState: TileState) {
    const currentAdversarialTiles: Tile[][] = this.$internalAdversarialTiles.value;
    const adversarialTile: Tile = currentAdversarialTiles[coordinates.rowIndex][coordinates.columnIndex];

    // TODO: FIXME: implement
    // adversarialTile.isStartTile = false;
    // adversarialTile.isEndTile = false;
    // adversarialTile.isHorizontal = false;

    // DEBUGGING:
    console.log('receiving (adversarial) tile state:' + JSON.stringify(coordinates, null, 4) + ':' + tileState);

    adversarialTile.tileState = tileState;

    // flush it as the state has just been changed
    this.$internalAdversarialTiles.next(currentAdversarialTiles);
  }
}
