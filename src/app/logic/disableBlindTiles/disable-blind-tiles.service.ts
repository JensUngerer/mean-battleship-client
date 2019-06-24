import { Injectable } from '@angular/core';
import { Tile } from '../tile/tile';

@Injectable({
  providedIn: 'root'
})
export class DisableBlindTilesService {

  constructor() { }

  public disableBlindTiles(tiles: Tile[][]) {
    for (let i = 0; i < tiles.length; i++) {
      this.disableFirstRowEntry(i, tiles);
      this.disableLastColumnEntry(i, tiles);
      this.disableLastRowEntry(i, tiles);
      this.disableFirstColumnEntry(i, tiles);
    }
  }

  private disableFirstRowEntry(i: number, tiles: Tile[][]) {
    this.disableBlindTile(0, i, tiles);
  }

  private disableLastColumnEntry(i: number, tiles: Tile[][]) {
    this.disableBlindTile(i, tiles[i].length - 1, tiles);
  }

  private disableLastRowEntry(i: number, tiles: Tile[][]) {
    this.disableBlindTile(tiles[i].length - 1, i, tiles);
  }

  private disableFirstColumnEntry(i: number, tiles: Tile[][]) {
    this.disableBlindTile(i, 0, tiles);
  }

  private disableBlindTile(rowIndex: number, columnIndex: number, tiles: Tile[][]) {
    const tile: Tile = tiles[rowIndex][columnIndex];
    tile.isDisabled = true;
    tile.isBlindTile = true;
  }
}
