import { ComponentFixture, TestBed } from '@angular/core/testing';

import { minesweeperTileComponent } from './minesweeper-tile.component';

describe('minesweeperTileComponent', () => {
  let component: minesweeperTileComponent;
  let fixture: ComponentFixture<minesweeperTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ minesweeperTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(minesweeperTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
