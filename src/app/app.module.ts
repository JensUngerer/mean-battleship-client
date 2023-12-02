import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShipGeneratorService } from 'src/app/logic/ship-generator/ship-generator.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';
import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { GameService } from './logic/game/game.service';
import { TileGeneratorService } from './logic/tileGenerator/tile-generator.service';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockingUiLayerComponent } from './blocking-ui-layer/blocking-ui-layer.component';
import { SocketService } from './logic/communication/socketService/socket.service';
import { CurrentGameStateComponent } from './view/current-game-state/current-game-state.component';
import { FieldComponent } from './view/field/field.component';
import { GameStartComponent } from './view/game-start/game-start.component';
import { GameComponent } from './view/game/game.component';
import { LegendTileCornerComponent } from './view/legend-tile-corner/legend-tile-corner.component';
import { LegendTileComponent } from './view/legend-tile/legend-tile.component';
import { TileComponent } from './view/tile/tile.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FieldComponent,
    GameStartComponent,
    LegendTileComponent,
    LegendTileCornerComponent,
    TileComponent,
    CurrentGameStateComponent,
    BlockingUiLayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    TileGeneratorService,
    SocketService,
    SocketReceiveService,
    SocketSendService,
    ShipGeneratorService,
    {provide: 'FieldSizeToken', useValue: 5},
    {provide: 'ShipSizesToken', useValue: [2, 1]},
    GameService,
    // {
    //   provide: GameService, // https://stackoverflow.com/questions/55230263/angular-7-injected-service-is-undefined
    //   deps: [Number, Array],
    //   providers: []
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
