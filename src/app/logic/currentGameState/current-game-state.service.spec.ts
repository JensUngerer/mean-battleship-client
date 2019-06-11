import { TestBed } from '@angular/core/testing';

import { CurrentGameStateService } from './current-game-state.service';

describe('CurrentGameStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentGameStateService = TestBed.get(CurrentGameStateService);
    expect(service).toBeTruthy();
  });
});
