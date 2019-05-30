import { TileState } from '../../../../../common/src/tileState/tileState.enum';
import { Ship } from '../ship/ship';

export class Tile {

  public color: string;
  public text: string;

  public ship: Ship;
  public isStartTile = false;
  public isEndTile = false;

  private internalTileState: TileState;

  constructor(private isDomesticTile: boolean,
              public xCoordinate: number,
              public yCoordinate: number,
              public isDisabled: boolean,
              tileState: TileState) {
    this.tileState = tileState;
  }

  public get tileState(): TileState {
    return this.internalTileState;
  }

  public set tileState(state: TileState) {
    this.internalTileState = state;
    switch (this.internalTileState) {
      case TileState.Water:
        this.color = 'navy';
        this.text = '';
        break;
      case TileState.WaterFired:
        this.color = 'navy';
        this.text = '/';
        break;
      case TileState.Ship:
        this.color = 'gray';
        this.text = '';
        // this.setColoredBorder('red');
        break;
      case TileState.ShipFired:
        this.color = 'navy';
        this.text = 'X';
        break;
      case TileState.ShipSunken:
        this.color = 'red';
        this.text = 'X';
        // this.setColoredBorder('red');
        break;
    }
  }
}
