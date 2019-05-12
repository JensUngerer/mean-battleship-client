import { Tile } from './../../logic/tile/tile';
import { TileGeneratorService } from './../../logic/tileGenerator/tile-generator.service';
import { Component, OnInit, Output, HostBinding, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ITileCoordinates } from '../../../../../common/src/tileCoordinates/iTileCoordinates';

@Component({
  selector: 'bs-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit, OnChanges {

  @Input()
  public caption: string;

  @Output()
  public legendTiles: string[] = [];

  //@Output()
  //public tiles: [][] = [];

  @Input()
  public isDomesticField: boolean;

  //@Input()
  //public fieldSize: number;

  @Input()
  public tiles: Tile[][];

  private fieldSize: number;

  @HostBinding('class.fieldContainer') private isFieldContainerClass = true;
  @HostBinding('class.domesticField') private isDomesticFieldClass = false;
  @HostBinding('class.adversarialField') private isAdversarialFieldClass = false;

  constructor(private tileGeneratorService: TileGeneratorService) {
  }

  ngOnInit() {
    this.fieldSize = this.tiles.length;

    this.isDomesticFieldClass = this.isDomesticField;
    this.isAdversarialFieldClass = !this.isDomesticField;

    this.initializeField();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.initializeField();
  }

  public firedOnTile(coordinates: ITileCoordinates) {
    console.log('received tile-coordinates:' + coordinates.rowIndex + ' ' + coordinates.columnIndex);
  }

  private initializeField() {
    if(this.tileGeneratorService && this.tileGeneratorService.generateLegendTiles){
      this.legendTiles = this.tileGeneratorService.generateLegendTiles(this.fieldSize);
    }
  }
}
