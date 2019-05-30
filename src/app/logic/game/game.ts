import { SocketSendService } from './../communication/sendService/socket-send.service';
import { Tile } from '../tile/tile';
import { ITileCoordinates } from '../../../../../common/src/tileCoordinates/iTileCoordinates';
import { TileState } from '../../../../../common/src/tileState/tileState.enum';
import { Inject } from '@angular/core';

export class Game {

  constructor(public domesticTiles: Tile[][],
              public adversarialTiles: Tile[][],
              private socketSendService: SocketSendService) {
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

  public setDomesticState(coordinates: ITileCoordinates) {
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

  private sendCoordinates(coordinates: ITileCoordinates){
    // DEBUGGING:
    // console.log(coordinates);
    this.socketSendService.coordinates(coordinates);
  }

  public receiveCoordinates(coordinates: ITileCoordinates) {
    this.setDomesticTileState(coordinates);
    this.sinkShipTiles(coordinates);
  }

  private sinkShipTiles(coordinates: ITileCoordinates) {
    // TODO: sink all ship tiles iff the last ship tile of a ship changes from fired to sunken
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
