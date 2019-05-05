import { TileGeneratorService } from './../../logic/tileGenerator/tile-generator.service';
import { Component, OnInit, Output, HostBinding, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'bs-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit, OnChanges {

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

  constructor(private tileGeneratorService: TileGeneratorService) {
  }

  ngOnInit() {
    this.isDomesticFieldClass = this.isDomesticField;
    this.isAdversarialFieldClass = !this.isDomesticField;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeField();
  }

  private initializeField() {
    if(this.tileGeneratorService && this.tileGeneratorService.generateLegendTiles){
      this.legendTiles = this.tileGeneratorService.generateLegendTiles(this.fieldSize);
    }
  }
}
