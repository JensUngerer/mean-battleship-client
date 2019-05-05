import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bs-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input()
  public text: string;

  constructor() { }

  ngOnInit() {
  }

}
