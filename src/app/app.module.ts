import { SocketSendService } from './logic/communication/sendService/socket-send.service';
import { SocketReceiveService } from './logic/communication/receiveService/socket-receive.service';
import { TileGeneratorService } from './logic/tileGenerator/tile-generator.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './view/game/game.component';
import { FieldComponent } from './view/field/field.component';
import { GameStartComponent } from './view/game-start/game-start.component';
import { GameStateComponent } from './view/game-state/game-state.component';
import { LegendTileComponent } from './view/legend-tile/legend-tile.component';
import { LegendTileCornerComponent } from './view/legend-tile-corner/legend-tile-corner.component';
import { TileComponent } from './view/tile/tile.component';
import { SocketService } from './logic/communication/socketService/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FieldComponent,
    GameStartComponent,
    GameStateComponent,
    LegendTileComponent,
    LegendTileCornerComponent,
    TileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    TileGeneratorService,
    SocketService,
    SocketReceiveService,
    SocketSendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
