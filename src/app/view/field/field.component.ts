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
  public legendTiles: [] = [];

  @Output()
  public tiles: [][] = [];

  @Input()
  public isDomesticField: boolean;

  @HostBinding('class.fieldContainer') private isFieldContainerClass = true;
  @HostBinding('class.domesticField') private isDomesticFieldClass = false;
  @HostBinding('class.adversarialField') private isAdversarialFieldClass = false;

  constructor() { }

  ngOnInit() {
    this.isDomesticFieldClass = this.isDomesticField;
    this.isAdversarialFieldClass = !this.isDomesticField;
  }

}
