import { GameState } from './../../../../../common/src/gameState/game-state.enum';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'bs-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {
  @Output()
  public GameState: any = GameState;

  @Input()
  public gameState: GameState;

  constructor() { }

  ngOnInit() {
  }

}
