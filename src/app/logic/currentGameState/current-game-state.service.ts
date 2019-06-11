import { Injectable } from '@angular/core';
import { GameState } from '../../../../../common/src/gameState/game-state.enum';

@Injectable({
  providedIn: 'root'
})
export class CurrentGameStateService {

  private internalGameStateToText: { [key: string]: string };

  private internalExpectedGameStates: GameState[] = [
    GameState.NotTurn,
    GameState.Turn,
    GameState.GameWon,
    GameState.GameLost,
    GameState.InitializationError,
    GameState.GameNotStarted
  ];

  private internalDotClasses: string[] = [
    'redDot',
    'greenDot',
    'blackDot',
    'blackDot',
    'blackDot',
    'blackDot'
  ];

  constructor() {
    this.internalGameStateToText = {};

    let gameStateAsString = GameState.NotTurn as string;
    this.internalGameStateToText[gameStateAsString] = 'It is not your turn: please wait until your game-partner finished.';

    gameStateAsString = GameState.Turn as string;
    this.internalGameStateToText[gameStateAsString] = 'It is your turn: please \'fire\' on a gaming-tile.';

    gameStateAsString = GameState.InitializationError as string;
    this.internalGameStateToText[gameStateAsString] = 'An initialization error occurred: please refresh the screen (F5).';

    gameStateAsString = GameState.GameWon as string;
    this.internalGameStateToText[gameStateAsString] = 'Game over: you have just won the game.';

    gameStateAsString = GameState.GameLost as string;
    this.internalGameStateToText[gameStateAsString] = 'Game over: you have just lost the game.';

    gameStateAsString = GameState.GameNotStarted as string;
    this.internalGameStateToText[gameStateAsString] = 'The game has not yet been started: please wait until' +
      ' a second game-partner connects to the server.';
  }

  public get gameStateToText(): { [key: string]: string } {
    return this.internalGameStateToText;
  }

  public get expectedGameStates(): string[] {
    return this.internalExpectedGameStates;
  }

  public get dotClasses(): string[] {
    return this.internalDotClasses;
  }
}
