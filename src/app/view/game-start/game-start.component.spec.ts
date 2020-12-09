import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameStartComponent } from './game-start.component';

describe('GameStartComponent', () => {
  let component: GameStartComponent;
  let fixture: ComponentFixture<GameStartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
