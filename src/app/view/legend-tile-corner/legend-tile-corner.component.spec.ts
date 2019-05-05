import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendTileCornerComponent } from './legend-tile-corner.component';

describe('LegendTileCornerComponent', () => {
  let component: LegendTileCornerComponent;
  let fixture: ComponentFixture<LegendTileCornerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendTileCornerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendTileCornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
