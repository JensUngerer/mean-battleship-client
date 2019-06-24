import { TestBed } from '@angular/core/testing';

import { DisableBlindTilesService } from './disable-blind-tiles.service';

describe('DisableBlindTilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisableBlindTilesService = TestBed.get(DisableBlindTilesService);
    expect(service).toBeTruthy();
  });
});
