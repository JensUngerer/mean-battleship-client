import { TileState } from '../../../../../common/src/tileState/tileState.enum';

export class Tile {

  public color: string;
  public text: string;

  private internalTileState: TileState;

  constructor(private isDomesticTile: boolean,
    private xCoordinate: number,
    private yCoordinate: number,
    private isDisabled: boolean,
    tileState: TileState) {
    this.tileState = tileState;
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
        this.color = 'navy';
        this.text = 'X';
        // this.setColoredBorder('red');
        break;
    }
  }
}
