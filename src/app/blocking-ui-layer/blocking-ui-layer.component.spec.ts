import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockingUiLayerComponent } from './blocking-ui-layer.component';

describe('BlockingUiLayerComponent', () => {
  let component: BlockingUiLayerComponent;
  let fixture: ComponentFixture<BlockingUiLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockingUiLayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockingUiLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
