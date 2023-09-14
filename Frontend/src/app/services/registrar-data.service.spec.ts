import { TestBed } from '@angular/core/testing';

import { RegistrarDataService } from './registrar-data.service';

describe('RegistrarDataService', () => {
  let service: RegistrarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
