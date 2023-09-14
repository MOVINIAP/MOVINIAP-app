import { TestBed } from '@angular/core/testing';

import { listCBX } from './ciudades.service';

describe('CiudadesService', () => {
  let service: listCBX;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(listCBX);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
