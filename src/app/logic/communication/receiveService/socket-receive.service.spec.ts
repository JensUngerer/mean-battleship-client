import { TestBed } from '@angular/core/testing';

import { SocketReceiveService } from './socket-receive.service';

describe('SocketReceiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketReceiveService = TestBed.get(SocketReceiveService);
    expect(service).toBeTruthy();
  });
});
