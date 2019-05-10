import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'src/app/logic/tile/tile';

@Component({
  selector: 'bs-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input()
  public tile: Tile;

  constructor() { }

  ngOnInit() {
  }

}
