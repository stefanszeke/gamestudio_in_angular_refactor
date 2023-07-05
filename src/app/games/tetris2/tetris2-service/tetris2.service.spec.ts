import { TestBed } from '@angular/core/testing';

import { Tetris2Service } from './tetris2.service';

describe('Tetris2Service', () => {
  let service: Tetris2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tetris2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
