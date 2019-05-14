import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'bs-game-start',
  templateUrl: './game-start.component.html',
  styleUrls: ['./game-start.component.css']
})
export class GameStartComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public navigateToGameView() {
    this.router.navigateByUrl('battleship-game');
  }

}
