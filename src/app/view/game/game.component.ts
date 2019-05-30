import { GameService } from './../../logic/game/game.service';
import { Tile } from './../../logic/tile/tile';
import { Component, OnInit, Output, Inject } from '@angular/core';

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
  public domesticTiles: Tile[][];

  @Output()
  public adversarialTiles: Tile[][];

  constructor(
    @Output()
    @Inject(GameService)
    public gameService: GameService
  ) {
    // DEBUGGING
    console.log('hello world!');
    this.gameService.initialize();
    console.log('Hello world two');
  }

  ngOnInit() {}
}
