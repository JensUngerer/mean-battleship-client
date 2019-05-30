import { Observable, Subject, BehaviorSubject } from 'rxjs';
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
  private internalDomesticTiles: BehaviorSubject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);
  private internalAdversarialTiles: BehaviorSubject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);

  private currentDomesticTiles: Tile[][] = [];
  private internalShips: BehaviorSubject<Ship[]> = new BehaviorSubject<Ship[]>([]);

  constructor(
    @Inject('FieldSizeToken')
    private fieldSize: number,
    @Inject('ShipSizesToken')
    private shipSizes: number[],
    @Inject(TileGeneratorService)
    private tileGeneratorService: TileGeneratorService,
    @Inject(ShipGeneratorService)
    private shipGeneratorService: ShipGeneratorService,
    @Inject(SocketSendService)
    private socketSendService: SocketSendService) {
  }

  public initialize() {
    // this.internalDomesticTiles.
    this.internalDomesticTiles.next(this.tileGeneratorService.generateTiles(
      this.fieldSize,
      true
    ));
    this.internalAdversarialTiles.next(this.tileGeneratorService.generateTiles(
      this.fieldSize,
      false
    ));
    this.internalDomesticTiles.subscribe((domesticTiles: Tile[][]) => {
      this.currentDomesticTiles = domesticTiles;
      const isShipGeneratorSuccessful: boolean = this.shipGeneratorService.generateShips(this.shipSizes, this.currentDomesticTiles);
      if (isShipGeneratorSuccessful) {
        this.internalShips.next(this.shipGeneratorService.ships);
      } else {
        this.internalShips.next([]);
        this.internalDomesticTiles.next(this.currentDomesticTiles);
      }
      //this.internalDomesticTiles.unsubscribe();
    });
  }

  public get domesticTiles(): Observable<Tile[][]> {
    return this.internalDomesticTiles;
  }

  public get adversarialTiles(): Observable<Tile[][]> {
    return this.internalAdversarialTiles;
  }

  public get ships(): BehaviorSubject<Ship[]> {
    return this.internalShips;
  }

  public onFired(coordinates: ITileCoordinates) {
    // DEBUGGING:
    // console.log(coordinates);

    // only for DEBUGGING purposes
    // this.receiveCoordinates(coordinates);


    // this.setDomesticTileState(coordinates);
    this.sendCoordinates(coordinates);

    // TODO: as a kind of response the adversarial tile-state has to be set...
    // this.setAdversarialTileState()
  }

  private setDomesticState(coordinates: ITileCoordinates) {
    // this.tileActions.receiveCoordinates(coordinates);

    // DEBUGGING:
    // console.log('Game-class');
    // console.log(coordinates);

    // 1)
    const domesticTile = this.domesticTiles[coordinates.rowIndex][coordinates.columnIndex];
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
    const shipIndex: number = TilesHelperService
      .isShipSunken(coordinates.rowIndex,
        coordinates.columnIndex,
        this.currentDomesticTiles,
        this.internalShips.value);
    // let newDomesticTileState: TileState = null;
    if (shipIndex !== -1) {
      const ship: Ship = this.internalShips.value[shipIndex];
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
      }
    }
  }

  private setDomesticTileState(coordinates: ITileCoordinates) {
    const domesticTile = this.domesticTiles[coordinates.rowIndex][coordinates.columnIndex];
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

  public receiveTileState(coordinates: ITileCoordinates, tileState: TileState) {
    const adversarialTile: Tile = this.adversarialTiles[coordinates.rowIndex][coordinates.columnIndex];

    // TODO: FIXME: implement
    // adversarialTile.isStartTile = false;
    // adversarialTile.isEndTile = false;
    // adversarialTile.isHorizontal = false;

    // DEBUGGING:
    console.log('receiving (adversarial) tile state:' + JSON.stringify(coordinates, null, 4) + ':' + tileState);

    adversarialTile.tileState = tileState;
  }
}
