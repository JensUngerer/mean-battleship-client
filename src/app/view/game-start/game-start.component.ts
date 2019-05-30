import { GameService } from './../../logic/game/game.service';
import { Component, OnInit, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
// import { TileGeneratorService } from 'src/app/logic/tileGenerator/tile-generator.service';
// import { ShipGeneratorService } from 'src/app/logic/ship-generator/ship-generator.service';
// import { SocketSendService } from 'src/app/logic/communication/sendService/socket-send.service';

@Component({
  selector: 'bs-game-start',
  templateUrl: './game-start.component.html',
  styleUrls: ['./game-start.component.css'],
  // providers: [
  //     {
  //     provide: GameService, // https://stackoverflow.com/questions/55230263/angular-7-injected-service-is-undefined
  //     deps: [5, [2, 1]]
  //   }
  //   // GameService
  // ]
})
export class GameStartComponent implements OnInit {

  // https://angular.io/api/core/testing/inject
  constructor(@Inject(Router) private router: Router,
    /*@Inject(GameService) private gameService*/) {
    // @Inject([5, [2, 1], GameService]) private gameService: GameService,
    // const injector = Injector.create({
    //   providers: [{
    //     provide: GameService,
    //     deps: [5, [1, 2], TileGeneratorService, ShipGeneratorService, SocketSendService],
    //     multi: false
    //   }]
    // });
    // const gameService: GameService = injector.get(GameService);
    // this.gameService.initialize();
  }

  ngOnInit() {
  }

  public navigateToGameView() {
    this.router.navigateByUrl('battleship-game');
  }

}
