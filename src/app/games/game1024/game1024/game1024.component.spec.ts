import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Game1024Component } from './game1024.component';

describe('Game1024Component', () => {
  let component: Game1024Component;
  let fixture: ComponentFixture<Game1024Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Game1024Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Game1024Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
