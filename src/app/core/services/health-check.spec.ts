import { TestBed } from '@angular/core/testing';

import { HealthCheck } from './health-check';

describe('HealthCheck', () => {
  let service: HealthCheck;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthCheck);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
