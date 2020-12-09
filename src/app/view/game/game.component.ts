import { CurrentGameStateService } from './../../logic/currentGameState/current-game-state.service';
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

  constructor(
    public gameService: GameService,
    public currentGameStateService: CurrentGameStateService
  ) {
    this.gameService.initialize(5, [2, 1]);
  }

  ngOnInit() { }
}
