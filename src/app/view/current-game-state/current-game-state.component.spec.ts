import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CurrentGameStateComponent } from './current-game-state.component';

describe('CurrentGameStateComponent', () => {
  let component: CurrentGameStateComponent;
  let fixture: ComponentFixture<CurrentGameStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentGameStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentGameStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
