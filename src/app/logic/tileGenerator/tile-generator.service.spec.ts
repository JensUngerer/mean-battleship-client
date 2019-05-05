import { TestBed } from '@angular/core/testing';

import { TileGeneratorService } from './tile-generator.service';

describe('TileGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TileGeneratorService = TestBed.get(TileGeneratorService);
    expect(service).toBeTruthy();
  });
});
