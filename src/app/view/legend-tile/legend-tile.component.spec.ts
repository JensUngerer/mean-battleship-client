import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LegendTileComponent } from './legend-tile.component';

describe('LegendTileComponent', () => {
  let component: LegendTileComponent;
  let fixture: ComponentFixture<LegendTileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
