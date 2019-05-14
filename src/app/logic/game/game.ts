import { Tile } from '../tile/tile';
import { ITileCoordinates } from '../../../../../common/src/tileCoordinates/iTileCoordinates';
import { TileState } from '../../../../../common/src/tileState/tileState.enum';

export class Game {
  public domesticTiles: Tile[][];
  public adversarialTiles: Tile[][];

  constructor(domesticTiles: Tile[][],
              adversarialTiles: Tile[][]) {
    this.domesticTiles = domesticTiles;
    this.adversarialTiles = adversarialTiles;
  }

  public onFired: (coordinates: ITileCoordinates) => void = (coordinates: ITileCoordinates) => {
    // DEBUGGING:
    // console.log(coordinates);

    // only for DEBUGGING purposes
    this.receiveCoordinates(coordinates);


    // this.setDomesticTileState(coordinates);
    this.sendCoordinates(coordinates);

    // TODO: as a kind of response the adversarial tile-state has to be set...
    // this.setAdversarialTileState()
  }

  private sendCoordinates(coordinates: ITileCoordinates){
    // DEBUGGING:
    console.log(coordinates);
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
