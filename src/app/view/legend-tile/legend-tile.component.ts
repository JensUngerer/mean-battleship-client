import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bs-legend-tile',
  templateUrl: './legend-tile.component.html',
  styleUrls: [
    './legend-tile.component.css',
    './../css/tile.css'
  ]
})
export class LegendTileComponent implements OnInit {
  @Input()
  public caption: string;

  constructor() { }

  ngOnInit() {
  }

}
