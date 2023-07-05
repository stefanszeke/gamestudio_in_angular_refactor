import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tetris2GameComponent } from './tetris2-game.component';

describe('Tetris2GameComponent', () => {
  let component: Tetris2GameComponent;
  let fixture: ComponentFixture<Tetris2GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tetris2GameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tetris2GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
