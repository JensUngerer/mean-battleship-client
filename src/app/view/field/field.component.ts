import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bs-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Output()
  public caption: string = 'TODO: Title of field';
  
  @Output()
  public legendTiles: [] = [];

  @Output()
  public tiles: [][] = [];

  constructor() { }

  ngOnInit() {
  }

}
