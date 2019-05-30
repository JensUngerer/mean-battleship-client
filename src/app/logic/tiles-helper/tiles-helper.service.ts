import { Injectable } from '@angular/core';
import { Ship } from '../ship/ship';
import { Tile } from '../tile/tile';
import { TileState } from '../../../../../common/src/tileState/tileState.enum';

@Injectable({
  providedIn: 'root'
})
export class TilesHelperService {

  public static searchCorrespondingShip(rowIndex: number, columnIndex: number, ships: Ship[]): Ship {
    let foundShip: Ship = null;
    ships.forEach((ship) => {
      if (ship.comprises(rowIndex, columnIndex)) {
        foundShip = ship;
      }
    });
    return foundShip;
  }

  public static isShipSunken(rowIndex: number, columnIndex: number, domesticTiles: Tile[][], ships: Ship[]) {
    let isShipSunken = true;
    const ship = TilesHelperService.searchCorrespondingShip(rowIndex, columnIndex, ships);
    if (ship !== null) {
      const firstRowIndex = ship.rowIndex;
      const firstColumnIndex = ship.columnIndex;
      for (let i = 0; i < ship.size; i++) {
        let tileState = domesticTiles[firstRowIndex][firstColumnIndex + i].tileState;
        if (ship.horizontal) {
          if (tileState === TileState.Ship) {
            isShipSunken = false;
            break;
          }
        } else {
          tileState = domesticTiles[firstRowIndex + i][firstColumnIndex].tileState;
          if (tileState === TileState.Ship) {
            isShipSunken = false;
            break;
          }
        }
      }
      if (isShipSunken) {
        return ship.shipIndex;
      } else {
        return -1;
      }
    }
    return -1;
  }

  public static place(ship: Ship, tiles: Tile[][]) {
    const rowIndex = ship.rowIndex;
    const columnIndex = ship.columnIndex;
    const shipIndex = ship.shipIndex;
    for (let i = 0; i < ship.size; i++) {
      if (ship.horizontal) {
        tiles[rowIndex][columnIndex + i].tileState = TileState.Ship;
        tiles[rowIndex][columnIndex + i].text = ship.size + 'H' + shipIndex;
        tiles[rowIndex][columnIndex + i].ship = ship;
      } else {
        tiles[rowIndex + i][columnIndex].tileState = TileState.Ship;
        tiles[rowIndex + i][columnIndex].text = ship.size + 'V' + shipIndex;
        tiles[rowIndex + i][columnIndex].ship = ship;
      }
    }
    if (ship.horizontal) {
      tiles[rowIndex][columnIndex].isStartTile = true;
      tiles[rowIndex][columnIndex + (ship.size - 1)].isEndTile = true;
    } else {
      tiles[rowIndex][columnIndex].isStartTile = true;
      tiles[rowIndex + (ship.size - 1)][columnIndex].isEndTile = true;
    }
  }

  constructor() { }

}
