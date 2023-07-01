import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
MathFloor(arg0: number) {
throw new Error('Method not implemented.');
}

  menuItems: string[] = ["minesweeper", "blocks", "game1024", "tetris", "snake"];
  menuPosition: number = 0;
  menuCurrent: string[] = [];
  menuSize: number = 5;

  leftPosition: number = 0;
  transition: string = "left 0.5s ease-in";
  transitionTime: number = 180;
  isTransitioning: boolean = false;

  ngOnInit(): void {
    this.generateCurrentMenu();
  }

  generateCurrentMenu(): void {
    let start: number = (Math.ceil(this.menuSize/2));
    let end: number = (Math.ceil(this.menuSize/2));
    console.log(start, end);
    if(this.menuSize % 2 !== 0) { start--; }
    if(this.menuPosition < start) { start = this.menuPosition; }
    this.menuCurrent = this.menuItems.slice(this.menuPosition - start, this.menuPosition + end);
    console.log(this.menuCurrent);

    if(this.menuCurrent.length < this.menuSize) {
      console.log("not enough items");
      let atEnd: boolean = false;
      if(this.menuCurrent[this.menuCurrent.length - 1] === this.menuItems[this.menuItems.length - 1]) {
        atEnd = true;
      }
      console.log(atEnd? "at end" : "at start");

      const DIFF: number = this.menuSize - this.menuCurrent.length;

      if(atEnd) {
        for(let i = 0; i < DIFF; i++) {
          this.menuCurrent.push(this.menuItems[i]);
        }
      } else {
        for(let i = 0; i < DIFF; i++) {
          this.menuCurrent.unshift(this.menuItems[this.menuItems.length - 1 - i]);
        }
      }
      console.log(this.menuCurrent);
    }
  }

  incrementMenuPosition(): void {
    if(this.menuPosition < this.menuItems.length - 1) {
      this.menuPosition++;
    } else {
      this.menuPosition = 0;
    }
    this.generateCurrentMenu();
  }

  decrementMenuPosition(): void {
    if(this.menuPosition > 0) {
      this.menuPosition--;
    } else {
      this.menuPosition = this.menuItems.length - 1;
    }
    this.generateCurrentMenu();
  }

  moveLeft(): void {
    this.leftPosition -= 130;
    this.isTransitioning = true;
    setTimeout(() => {
      this.transition = `left 0s ease-in-out`;
      this.incrementMenuPosition();
      this.leftPosition = 0;
      this.isTransitioning = false;
    }
    , this.transitionTime)

    this.transition = `left ${this.transitionTime}ms ease-in-out`;
  }

  moveRight(): void {
    this.leftPosition += 130;
    this.isTransitioning = true;
    setTimeout(() => {
      this.transition = `left 0s ease-in-out`;
      this.decrementMenuPosition();
      this.leftPosition = 0;
      this.isTransitioning = false;
    }, this.transitionTime)

    this.transition = `left ${this.transitionTime}ms ease-in-out`;
  }

  setMenuPosition(i: number): void {
    this.menuPosition = i;
    this.generateCurrentMenu();
  }

  getMiddleIndex(): number {
    return Math.floor(this.menuSize/2);
  }

}
