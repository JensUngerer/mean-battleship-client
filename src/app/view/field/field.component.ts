import { Component, OnInit, Output, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'bs-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Output()
  public caption: string = 'TODO: Title of field';

  @Output()
  public legendTiles: string[] = [];

  @Output()
  public tiles: [][] = [];

  @Input()
  public isDomesticField: boolean;

  @Input()
  public fieldSize: number;

  @HostBinding('class.fieldContainer') private isFieldContainerClass = true;
  @HostBinding('class.domesticField') private isDomesticFieldClass = false;
  @HostBinding('class.adversarialField') private isAdversarialFieldClass = false;

  constructor() { }

  ngOnInit() {
    this.isDomesticFieldClass = this.isDomesticField;
    this.isAdversarialFieldClass = !this.isDomesticField;
    this.initializeField();
  }

  private initializeField() {
    const alphabet = ['A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y',
    'Z'];
    this.legendTiles = alphabet.splice(0, this.fieldSize);
  }

}
