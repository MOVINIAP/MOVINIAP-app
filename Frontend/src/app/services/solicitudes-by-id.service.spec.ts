import { TestBed } from '@angular/core/testing';

import { ListForByIdService } from './solicitudes-by-id.service';

describe('SolicitudesByIdService', () => {
  let service: ListForByIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListForByIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
