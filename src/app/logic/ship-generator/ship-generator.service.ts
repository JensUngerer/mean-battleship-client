import { Injectable } from '@angular/core';
import { Ship } from '../ship/ship';
import { Tile } from '../tile/tile';
import { TileState } from '../../../../../common/src/tileState/tileState.enum';
import { TilesHelperService } from '../tiles-helper/tiles-helper.service';

@Injectable({
  providedIn: 'root'
})
export class ShipGeneratorService {
  private internalShips: Ship[];
  private tiles: Tile[][];
  private playingFieldSize: number;

  constructor() { }

  public get ships(): Ship[] {
    return this.internalShips;
  }

  public generateShips(shipSizes: Array<number>, tiles: Tile[][]) {
    this.internalShips = [];
    this.tiles = tiles;
    this.playingFieldSize = tiles.length;
    this.generateInitialShips(shipSizes);

    return this.placeShips();
  }

  private generateInitialShips(shipSizes: number[]) {
    for (let shipIndex = 0; shipIndex < shipSizes.length; shipIndex++) {
      const rowIndex = this.generateRandomIndex(this.playingFieldSize);
      const columnIndex = this.generateRandomIndex(this.playingFieldSize);
      const horizontal = this.generateRandomOrientation();
      this.internalShips.push(new Ship(horizontal,
        rowIndex, columnIndex, shipIndex, shipSizes[shipIndex]));
    }
  }

  private generateRandomIndex(size) {
    return Math.floor(Math.random() * (size - 1)) + 1;
  }

  private generateRandomOrientation() {
    return (Math.random() >= 0.5) ? true : false;
  }

  private placeShips() {
    const MAX_NUMBER_OF_RETRIES = 1e6;
    let ctr = 0;
    for (let shipIndex = 0; shipIndex < this.internalShips.length; shipIndex++) {
      const ship = this.internalShips[shipIndex];
      let isValid = true;
      do {
        isValid = this.isPlacedShipValid(ship);
        if (!isValid) {
          ship.rowIndex = this.generateRandomIndex(this.playingFieldSize);
          ship.columnIndex = this.generateRandomIndex(this.playingFieldSize);
          ship.horizontal = this.generateRandomOrientation();
        }
        ctr++;
      } while (!isValid && ctr < MAX_NUMBER_OF_RETRIES);
      if (ctr === MAX_NUMBER_OF_RETRIES) {
        this.resetThePreviouslySetShips();
        this.internalShips = [];
        return false;
      }
      TilesHelperService.place(ship, this.tiles);
    }
    // this.dispatchShips();
    return true;
  }

  private resetThePreviouslySetShips() {
    this.ships.forEach((oneShip: Ship) => {
      for(let i = 0; i < oneShip.size; i++) {
        if(oneShip.horizontal){
          this.tiles[oneShip.rowIndex][oneShip.columnIndex + i].tileState = TileState.Water;
          this.tiles[oneShip.rowIndex][oneShip.columnIndex + i].ship = null;
        } else {
          this.tiles[oneShip.rowIndex + i][oneShip.columnIndex].tileState = TileState.Water;
          this.tiles[oneShip.rowIndex + i][oneShip.columnIndex].ship = null;
        }
      }
    });
  }

  // private dispatchShips() {
  //   this.ships.forEach((ship) => {
  //     setTimeout(() => { this.shipActions.add(ship); });
  //   });
  // }

  private isBiggerThanField(ship: Ship) {
    const firstRowIndex = ship.rowIndex;
    const firstColumnIndex = ship.columnIndex;
    if (ship.horizontal) {
      if ((firstColumnIndex + ship.size) > (this.playingFieldSize - 1)) {
        return true;
      }
    } else {
      if ((firstRowIndex + ship.size) > (this.playingFieldSize - 1)) {
        return true;
      }
    }
    return false;
  }

  private isAnyOfTheFieldsBlocked(ship) {
    const firstRowIndex = ship.rowIndex;
    const firstColumnIndex = ship.columnIndex;
    for (let i = 0; i < ship.size; i++) {
      if (ship.horizontal) {
        if (this.tiles[firstRowIndex][firstColumnIndex + i].tileState !== TileState.Water) {
          return true;
        }
      } else {
        if (this.tiles[firstRowIndex + i][firstColumnIndex].tileState !== TileState.Water) {
          return true;
        }
      }
    }
    return false;
  }

  private isNoSpaceAround(ship) {
    const firstRowIndex = ship.rowIndex;
    const firstColumnIndex = ship.columnIndex;

    // horizontal on upper corner

    if (ship.horizontal) {
      // row above
      for (let i = 0; i < ship.size + 2; i++) {
        if (typeof this.tiles[firstRowIndex - 1] === 'undefined' ||
          typeof this.tiles[firstRowIndex - 1][firstColumnIndex - 1 + i] === 'undefined' ||
          this.tiles[firstRowIndex - 1][firstColumnIndex - 1 + i].tileState !== TileState.Water) {
          return true;
        }
      }
      // actual row
      for (let i = 0; i < ship.size + 2; i++) {
        if (typeof this.tiles[firstRowIndex] === 'undefined' ||
          typeof this.tiles[firstRowIndex][firstColumnIndex - 1 + i] === 'undefined' ||
          this.tiles[firstRowIndex][firstColumnIndex - 1 + i].tileState !== TileState.Water) {
          return true;
        }
      }
      // row below
      for (let i = 0; i < ship.size + 2; i++) {
        if (typeof this.tiles[firstRowIndex + 1] === 'undefined' ||
          typeof this.tiles[firstRowIndex + 1][firstColumnIndex - 1 + i] === 'undefined' ||
          this.tiles[firstRowIndex + 1][firstColumnIndex - 1 + i].tileState !== TileState.Water) {
          return true;
        }
      }
    } else {
      // column to the left
      for (let i = 0; i < ship.size + 2; i++) {
        if (typeof this.tiles[firstRowIndex - 1 + i] === 'undefined' ||
          typeof this.tiles[firstRowIndex - 1 + i][firstColumnIndex - 1] === 'undefined' ||
          this.tiles[firstRowIndex - 1 + i][firstColumnIndex - 1].tileState !== TileState.Water) {
          return true;
        }
      }
      // actual column
      for (let i = 0; i < ship.size + 2; i++) {
        if (typeof this.tiles[firstRowIndex - 1 + i] === 'undefined' ||
          typeof this.tiles[firstRowIndex - 1 + i][firstColumnIndex] === 'undefined' ||
          this.tiles[firstRowIndex - 1 + i][firstColumnIndex].tileState !== TileState.Water) {
          return true;
        }
      }
      // column to the right
      for (let i = 0; i < ship.size + 2; i++) {
        if (typeof this.tiles[firstRowIndex - 1 + i] === 'undefined' ||
          typeof this.tiles[firstRowIndex - 1 + i][firstColumnIndex + 1] === 'undefined' ||
          this.tiles[firstRowIndex - 1 + i][firstColumnIndex + 1].tileState !== TileState.Water) {
          return true;
        }
      }
    }
    return false;
  }

  private isPlacedShipValid(ship: Ship) {
    if (this.isBiggerThanField(ship)) {
      return false;
    }
    if (this.isAnyOfTheFieldsBlocked(ship)) {
      return false;
    }
    if (this.isNoSpaceAround(ship)) {
      return false;
    }

    return true;
  }
}
