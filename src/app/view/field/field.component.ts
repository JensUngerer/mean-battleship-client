import { EventEmitter } from '@angular/core';
import { Tile } from './../../logic/tile/tile';
import { TileGeneratorService } from './../../logic/tileGenerator/tile-generator.service';
import { Component, OnInit, Output, HostBinding, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ITileCoordinates } from '../../../../../common/src/tileCoordinates/iTileCoordinates';
import { GameState } from '../../../../../common/src/gameState/game-state.enum';

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

  @Input()
  public isDomesticField: boolean;

  @Input()
  public tiles: Tile[][];

  @Input()
  public gameState: GameState;

  @Output()
  public fired: EventEmitter<ITileCoordinates> = new EventEmitter<ITileCoordinates>();

  private fieldSize: number;

  @HostBinding('class.fieldContainer') private isFieldContainerClass = true;
  @HostBinding('class.domesticField') private isDomesticFieldClass = false;
  @HostBinding('class.adversarialField') private isAdversarialFieldClass = false;

  constructor(private tileGeneratorService: TileGeneratorService) {
  }

  ngOnInit() {
    // this.fieldSize = this.tiles.length;

    // this.isDomesticFieldClass = this.isDomesticField;
    // this.isAdversarialFieldClass = !this.isDomesticField;

    // this.initializeField();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tiles) {
      this.fieldSize = this.tiles.length;
      this.initializeField();
    }
    this.isDomesticFieldClass = this.isDomesticField;
    this.isAdversarialFieldClass = !this.isDomesticField;
  }

  public onFired(coordinates: ITileCoordinates) {
    console.log('send tile-coordinates:' + coordinates.rowIndex + ' ' + coordinates.columnIndex);

    this.fired.emit(coordinates);
  }

  private initializeField() {
    if (this.tileGeneratorService && this.tileGeneratorService.generateLegendTiles) {
      this.legendTiles = this.tileGeneratorService.generateLegendTiles(this.fieldSize);
    }
  }
}
