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

  private sendCoordinates(coordinates: ITileCoordinates){
    // DEBUGGING:
    // console.log(coordinates);
    this.socketSendService.coordinates(coordinates);
  }

  public receiveCoordinates(coordinates: ITileCoordinates) {
    this.setDomesticTileState(coordinates);
  }


  public setDomesticTileState(coordinates: ITileCoordinates) {
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

}
