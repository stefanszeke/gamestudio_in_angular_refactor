import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocksTileComponent } from './blocks-tile.component';

describe('BlocksTileComponent', () => {
  let component: BlocksTileComponent;
  let fixture: ComponentFixture<BlocksTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocksTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocksTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
