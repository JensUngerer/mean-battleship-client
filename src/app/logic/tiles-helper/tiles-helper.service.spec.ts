import { TestBed } from '@angular/core/testing';

import { TilesHelperService } from './tiles-helper.service';

describe('TilesHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TilesHelperService = TestBed.get(TilesHelperService);
    expect(service).toBeTruthy();
  });
});
