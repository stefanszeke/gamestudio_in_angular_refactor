import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Game1024TileComponent } from './game1024-tile.component';

describe('Game1024TileComponent', () => {
  let component: Game1024TileComponent;
  let fixture: ComponentFixture<Game1024TileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Game1024TileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Game1024TileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
