import { GameState } from './../../../../../common/src/gameState/game-state.enum';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bs-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {

  @Input()
  public gameState: GameState;

  constructor() { }

  ngOnInit() {
  }

}
