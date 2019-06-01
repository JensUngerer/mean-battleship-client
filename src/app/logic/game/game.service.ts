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
  private $internalShips: BehaviorSubject<Ship[]> = new BehaviorSubject<Ship[]>([]);

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

      this.socketSendService.startGame();
    } else {
      this.$internalShips.next([]);
      this.$internalDomesticTiles.next([]);
      this.$internalAdversarialTiles.next([]);

      alert('initialization error - please, refresh browser-window (F5)');
    }
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
    this.sendCoordinates(coordinates);
  }

  private setDomesticState(coordinates: ITileCoordinates) {
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
  }

  private sendCoordinates(coordinates: ITileCoordinates) {
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
  }

  private sendTileState(coordinates: ITileCoordinates) {
    const currentDomesticTiles: Tile[][] = this.$internalDomesticTiles.value;
    const updatedDomesticTile: Tile = currentDomesticTiles[coordinates.rowIndex][coordinates.columnIndex];
    this.socketSendService.tileState({
      columnIndex: coordinates.columnIndex,
      rowIndex: coordinates.columnIndex,
      isEndTile: updatedDomesticTile.isEndTile,
      isHorizontal: false, // TODO: FIXME: how is this state used and how is it possible to set it (e.g. from the ship-data)
      isStartTile: updatedDomesticTile.isStartTile,
      tileState: updatedDomesticTile.tileState
    });
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
