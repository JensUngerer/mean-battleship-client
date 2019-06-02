import { TileState } from '../../../../../common/src/tileState/tileState.enum';
import { Ship } from '../ship/ship';
import { GameState } from '../../../../../common/src/gameState/game-state.enum';

export class Tile {

  public color: string;
  public text: string;

  public ship: Ship;
  public isStartTile = false;
  public isEndTile = false;

  private internalTileState: TileState;

  constructor(private isDomesticTile: boolean,
    public xCoordinate: number,
    public yCoordinate: number,
    public isDisabled: boolean,
    tileState: TileState) {
    this.tileState = tileState;
  }

  public set gameState(gameState: GameState) {
    if (this.isDomesticTile) {
      return;
    }
    switch (gameState) {
      case GameState.GameNotStarted:
        this.isDisabled = true;
        break;
      case GameState.Turn:
        this.isDisabled = false;
        break;
      case GameState.NotTurn:
        this.isDisabled = true;
        break;
      case GameState.GameLost:
        this.isDisabled = true;
        break;
      case GameState.GameWon:
        this.isDisabled = true;
        break;
      case GameState.InitializationError:
        this.isDisabled = true;
        break;
      default:
        console.error('unknown behavior for gameState:' + gameState);
        this.isDisabled = true;
        break;
    }
  }


  public get tileState(): TileState {
    return this.internalTileState;
  }

  public set tileState(state: TileState) {
    this.internalTileState = state;
    switch (this.internalTileState) {
      case TileState.Water:
        this.color = 'navy';
        this.text = '';
        break;
      case TileState.WaterFired:
        this.color = 'navy';
        this.text = '/';
        break;
      case TileState.Ship:
        this.color = 'gray';
        this.text = '';
        // this.setColoredBorder('red');
        break;
      case TileState.ShipFired:
        this.color = 'navy';
        this.text = 'X';
        break;
      case TileState.ShipSunken:
        this.color = 'red';
        this.text = 'X';
        // this.setColoredBorder('red');
        break;
    }
  }
}
