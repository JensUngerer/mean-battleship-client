import { SocketReceiveService } from './../../logic/communication/receiveService/socket-receive.service';
import { SocketSendService } from './../../logic/communication/sendService/socket-send.service';
import { TileGeneratorService } from './../../logic/tileGenerator/tile-generator.service';
import { Tile } from './../../logic/tile/tile';
import { Component, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/logic/game/game';
import { ShipGeneratorService } from 'src/app/logic/ship-generator/ship-generator.service';

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
  @Output()
  public fieldSize = 5;

  @Output()
  public domesticTiles: Tile[][];

  @Output()
  public adversarialTiles: Tile[][];

  @Output()
  public game: Game;

  constructor(private tileGeneratorService: TileGeneratorService,
              private shipGeneratorService: ShipGeneratorService,
              private socketSendService: SocketSendService,
              private socketReceiveService: SocketReceiveService) {
    const domesticTiles = this.tileGeneratorService.generateTiles(this.fieldSize, true);
    const adversarialTiles = this.tileGeneratorService.generateTiles(this.fieldSize, false);
    const shipSizes: number[] = [1, 2];
    this.shipGeneratorService.generateShips(shipSizes, domesticTiles);
    this.game = new Game(domesticTiles, adversarialTiles, this.socketSendService);
    this.socketReceiveService.game = this.game;
  }

  ngOnInit() {
  }

}
