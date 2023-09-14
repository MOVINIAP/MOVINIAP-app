import { TestBed } from '@angular/core/testing';

import { ListAllService } from './solicitudes-all.service';

describe('SolicitudesAllService', () => {
  let service: ListAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
