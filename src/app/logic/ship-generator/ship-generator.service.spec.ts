import { TestBed } from '@angular/core/testing';

import { ShipGeneratorService } from './ship-generator.service';

describe('ShipGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShipGeneratorService = TestBed.get(ShipGeneratorService);
    expect(service).toBeTruthy();
  });
});
