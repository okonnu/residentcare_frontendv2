import { TestBed } from '@angular/core/testing';

import { SearchResidentServicesService } from './resident.service';

describe('SearchResidentServicesService', () => {
  let service: SearchResidentServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchResidentServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
