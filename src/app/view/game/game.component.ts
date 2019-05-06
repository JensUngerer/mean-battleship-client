import { TileGeneratorService } from './../../logic/tileGenerator/tile-generator.service';
import { Tile } from './../../logic/tile/tile';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bs-game',
  templateUrl: './game.component.html',
  styleUrls: [
    './game.component.css',
    './../css/domestic-field.css',
    './../css/adversarial-field.css'
  ]
})
export class GameComponent implements OnInit {
  @Output()
  public fieldSize = 5;

  @Output()
  public domesticTiles: Tile[][];

  @Output()
  public adversarialTiles: Tile[][];

  constructor(private tileGeneratorService: TileGeneratorService) {
    this.domesticTiles = this.tileGeneratorService.generateTiles(this.fieldSize, true);
    this.adversarialTiles = this.tileGeneratorService.generateTiles(this.fieldSize, false);
  }

  ngOnInit() {
  }

}
