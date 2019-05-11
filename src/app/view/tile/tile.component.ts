import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'src/app/logic/tile/tile';

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

  constructor() { }

  ngOnInit() {
  }

  public fire($event: any) {
    console.log('tile with coordinates:' +
      (this.tile.xCoordinate + 1) +
      ' ' +
      (this.tile.yCoordinate + 1) +
      ' has just been fired');
  }
}
