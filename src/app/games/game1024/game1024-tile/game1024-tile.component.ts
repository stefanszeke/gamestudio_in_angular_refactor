import { Component, Input } from '@angular/core';
import { IGame1024Tile } from '../game1024-model/IGame1024Tile';

@Component({
  selector: 'app-game1024-tile',
  templateUrl: './game1024-tile.component.html',
  styleUrls: ['./game1024-tile.component.scss']
})
export class Game1024TileComponent implements IGame1024Tile {
  @Input() value: number = 0;
  @Input() hidden: boolean = true;

  class: string = 'tile';

  isEmpty(): boolean {
    return this.value === 0;
  }

  mergeWith(other: IGame1024Tile): boolean {
    if (this.value === other.value) {
      this.value *= 2;
      other.value = 0;
      return true;
    }
    return false;
  }

  getStyle(): string {
    if(!this.hidden) {
      switch (this.value) {
        case 1 : return 'tile tile-1';
        case 2 : return 'tile tile-2';
        case 4 : return 'tile tile-4';
        case 8 : return 'tile tile-8';
        case 16 : return 'tile tile-16';
        case 32 : return 'tile tile-32';
        case 64 : return 'tile tile-64';
        case 128 : return 'tile tile-128';
        case 256 : return 'tile tile-256';
        case 512 : return 'tile tile-512';
        case 1024 : return 'tile tile-1024';
        default: return 'tile';
      } 
    } else {
      if(this.value === 0)return 'tile tile-0';
    }
    return 'tile';
  }

}
