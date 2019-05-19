import { TestBed } from '@angular/core/testing';

import { SocketSendService } from './socket-send.service';

describe('SocketSendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketSendService = TestBed.get(SocketSendService);
    expect(service).toBeTruthy();
  });
});
