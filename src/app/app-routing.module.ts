import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameStartComponent } from './view/game-start/game-start.component';
import { GameComponent } from './view/game/game.component';

const routes: Routes = [
  {path: '', redirectTo: 'battleship-game-start', pathMatch: 'full'},
  {path: 'battleship-game-start', component: GameStartComponent},
  {path: 'battleship-game', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
