import { Component, OnInit, Output } from '@angular/core';

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


  constructor() { }

  ngOnInit() {
  }

}
