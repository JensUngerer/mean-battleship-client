import { GameService } from './../../logic/game/game.service';
import { Tile } from './../../logic/tile/tile';
import { Component, OnInit, Output, Inject } from '@angular/core';
import { Ship } from 'src/app/logic/ship/ship';

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
  // @Output()
  // public fieldSize = 5;

  @Output()
  public $ships: Ship[];

  @Output()
  public $domesticTiles: Tile[][];

  @Output()
  public $adversarialTiles: Tile[][];

  constructor(
    @Output()
    @Inject(GameService)
    public gameService: GameService
  ) {
    // DEBUGGING
    // console.log('hello world!');
    this.gameService.initialize(5, [2, 1]);
    // console.log('Hello world two');
    // this.$ships = this.gameService.ships;
  }

  ngOnInit() {}
}
