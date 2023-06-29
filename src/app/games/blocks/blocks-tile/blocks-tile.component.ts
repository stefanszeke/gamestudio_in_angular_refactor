import { Component, Input } from '@angular/core';
import { BlocksTileColor } from '../blocks-model/BlocksTile';

@Component({
  selector: 'app-blocks-tile',
  templateUrl: './blocks-tile.component.html',
  styleUrls: ['./blocks-tile.component.scss']
})
export class BlocksTileComponent {
  @Input() color: BlocksTileColor = null;

  getStyle(): string {
      switch (this.color) {
        case 'red' : return 'block block-color block-red';
        case 'green' : return 'block block-color block-green';
        case 'blue' : return 'block block-color block-blue';
        case 'yellow' : return 'block block-color block-yellow';
        default: return 'block';
      }
  }

}
