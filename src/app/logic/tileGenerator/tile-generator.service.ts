import { Injectable } from '@angular/core';
import { Tile } from '../tile/tile';
import { TileState } from './../../../../../common/src/tileState/tileState.enum';

@Injectable({
  providedIn: 'root'
})
export class TileGeneratorService {
  private readonly alphabet = ['A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y',
    'Z'];

  constructor() { }

  public generateLegendTiles(fieldSize: number): string[] {
    const alphabetCopy: string[] = JSON.parse(JSON.stringify(this.alphabet));
    return alphabetCopy.splice(0, fieldSize);
  }

  public generateTiles(fieldSize: number, isDomesticTile: boolean): Tile[][] {
    const isTileDisabled: boolean = false;

    const tiles: Tile[][] = [];
    for (let i = 0; i < fieldSize; i++) {
      tiles[i] = [];
      for (let j = 0; j < fieldSize; j++) {
        tiles[i][j] = new Tile(isDomesticTile, i, j, isTileDisabled, TileState.Water);
      }
    }
    return tiles;
  }
}
