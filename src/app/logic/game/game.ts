import { Tile } from '../tile/tile';
import { ITileCoordinates } from '../../../../../common/src/tileCoordinates/iTileCoordinates';

export class Game {
  public domesticTiles: Tile[][];
  public adversarialTiles: Tile[][];

  constructor(domesticTiles: Tile[][],
              adversarialTiles: Tile[][]) {
    this.domesticTiles = domesticTiles;
    this.adversarialTiles = adversarialTiles;
  }

  public onFired: (coordinates: ITileCoordinates) => void = (coordinates: ITileCoordinates) => {
    console.log(coordinates);
  };
}
