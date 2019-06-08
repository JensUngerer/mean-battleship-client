import { GameState } from './../../../../../common/src/gameState/game-state.enum';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'bs-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {

  @Input()
  public gameState: GameState;

  @Output()
  public GameState: any = GameState;

  @Output()
  public getStateTextFrom(theGameState: GameState): string {
    switch (theGameState) {
      case GameState.Turn:
        return 'It is your turn: please \'fire\' on a gaming-tile.';
      case GameState.NotTurn:
        return 'It is not your turn: please wait until your game-partner finished.';
      case GameState.InitializationError:
        return 'An initialization error occurred: please refresh the screen (F5).';
      case GameState.GameWon:
        return 'Game over: you have just won the game.';
      case GameState.GameLost:
        return 'Game over: you have just lost the game.';
      case GameState.GameNotStarted:
        return 'The game has not yet been started: please wait until a second game-partner connects to the server.';
      default:
        return 'Unknown GameState-value';
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
