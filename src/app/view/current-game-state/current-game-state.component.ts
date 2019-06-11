import { Component, OnInit, Input, Output } from '@angular/core';
import { GameState } from '../../../../../common/src/gameState/game-state.enum';

@Component({
  selector: 'bs-current-game-state',
  templateUrl: './current-game-state.component.html',
  styleUrls: ['./current-game-state.component.css']
})
export class CurrentGameStateComponent implements OnInit {

  @Input()
  public gameState: GameState;

  @Input()
  public expectedGameStates: GameState[];

  @Input()
  public dotColorNames: string[];

  // https://github.com/Microsoft/TypeScript/issues/24220
  @Input()
  private gameStateToText: { [key: string]: string };


  @Output()
  public getStateTextFrom(theGameState: GameState): string {
    return this.gameStateToText[theGameState as string];
  }

  constructor() { }

  ngOnInit() {
  }

}
