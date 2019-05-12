import { Component, OnInit, Input, Output } from '@angular/core';
import { Tile } from 'src/app/logic/tile/tile';
import { EventEmitter } from '@angular/core';
import { ITileCoordinates } from './../../../../../common/src/tileCoordinates/iTileCoordinates';

@Component({
  selector: 'bs-tile',
  templateUrl: './tile.component.html',
  styleUrls: [
    './../../view/css/tile.css',
    './tile.component.css'
  ]
})
export class TileComponent implements OnInit {
  @Input()
  public tile: Tile;

  @Output()
  public fired: EventEmitter<ITileCoordinates> = new EventEmitter<ITileCoordinates>();

  constructor() { }

  ngOnInit() {
  }

  public fire($event: any) {
    this.fired.emit({
      rowIndex: this.tile.xCoordinate,
      columnIndex: this.tile.yCoordinate
    });
    console.log('tile with coordinates:' +
      (this.tile.xCoordinate + 1) +
      ' ' +
      (this.tile.yCoordinate + 1) +
      ' has just been fired on');
  }
}
