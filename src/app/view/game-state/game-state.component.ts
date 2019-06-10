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
  public gameStateToText: { [key: string]: string };

  constructor() {
  }

  ngOnInit() {
    this.gameStateToText = {};

    let gameStateAsString = GameState.NotTurn as string;
    this.gameStateToText[gameStateAsString] = 'It is not your turn: please wait until your game-partner finished.';

    gameStateAsString = GameState.Turn as string;
    this.gameStateToText[gameStateAsString] = 'It is your turn: please \'fire\' on a gaming-tile.';

    gameStateAsString = GameState.InitializationError as string;
    this.gameStateToText[gameStateAsString] = 'An initialization error occurred: please refresh the screen (F5).';

    gameStateAsString = GameState.GameWon as string;
    this.gameStateToText[gameStateAsString] = 'Game over: you have just won the game.';

    gameStateAsString = GameState.GameLost as string;
    this.gameStateToText[gameStateAsString] = 'Game over: you have just lost the game.';

    gameStateAsString = GameState.GameNotStarted as string;
    this.gameStateToText[gameStateAsString] = 'The game has not yet been started: please wait until' +
      ' a second game-partner connects to the server.';
  }
}
