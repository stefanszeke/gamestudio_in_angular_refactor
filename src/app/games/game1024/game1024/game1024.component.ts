import { Component, HostListener } from '@angular/core';
import { GameStatus } from '../../model/GameStatus';
import { IGame1024Tile } from '../game1024-model/IGame1024Tile';
import { Game1024TileComponent } from '../game1024-tile/game1024-tile.component';

@Component({
  selector: 'app-game1024',
  templateUrl: './game1024.component.html',
  styleUrls: ['./game1024.component.scss']
})
export class Game1024Component {

  gameField: IGame1024Tile[][] = [];
  size: number = 4;
  movedOrMerged: boolean = false;
  gameStatus: GameStatus = "playing";
  moveCount: number = 0;

  isUpPressed: boolean = false;
  isLeftPressed: boolean = false;
  isRightPressed: boolean = false;
  isDownPressed: boolean = false;

  // constructor(private store: Store) { }

  ngOnInit(): void {
    this.generateBoard();

    this.addRandomNumber();
    this.addRandomNumber();

    // this.store.dispatch(setCurrentGame({ game: 'Game1024' }));
    // this.store.dispatch(RatingActions.loadRating({ game: 'Game1024' }));
    // this.store.dispatch(ScoreActions.loadTopScoresByGame({ game: 'Game1024' }));
    // this.store.dispatch(CommentActions.loadComments({ game: 'Game1024' }));
  }

  generateBoard(): void {
    this.gameField = new Array(this.size).fill(null).map(() => new Array(this.size).fill(null).map(() => new Game1024TileComponent));
  }

  setHidden(i: number, j: number): boolean {
    if (this.gameField[i][j].value === 0) {
      return true;
    }
    return false;
  }

  addRandomNumber(): void {
    let validTile: boolean = false;

    let numberToAdd: number = Math.floor(Math.random() * 11) > 8 ? 2 : 1

    while (!validTile) {
      let randomRow: number = Math.floor(Math.random() * this.size)
      let randomCol: number = Math.floor(Math.random() * this.size)

      if (this.gameField[randomRow][randomCol].value === 0) {
        this.gameField[randomRow][randomCol].value = numberToAdd
        validTile = true;
      }
    }



  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const directionMap: { [key: string]: string } = {
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };

    const direction = directionMap[event.key];
    if (!direction) return;

    this.pressKey(direction);

    if (this.gameStatus !== "playing") return;

    this.movedOrMerged = false;
    this.handleMove(direction);

    if (this.movedOrMerged) {
      this.addRandomNumber();
      this.moveCount++;
    }

    if (this.isWon()) {
      this.gameStatus = "won";
      return;
    }

    if (this.isLost()) {
      this.gameStatus = "lost";
      return;
    }
  }





  handleMove(direction: string) {


    for (let i = 0; i < this.size; i++) {
      const tempArray = this.makeTempArrayToRightBasedOnDirectionAndIndex(direction, i);

      let move = this.arrayCanMoveRight(tempArray);
      while (move) {
        this.arrayMoveRight(tempArray);
        move = this.arrayCanMoveRight(tempArray);
        this.movedOrMerged = true;
      }
      this.arrayMergeRight(tempArray);

      this.switchFromRightTempArrayToGameFieldBasedOnDirectionAndIndex(direction, i, tempArray);
    }


  }

  arrayCanMoveRight(array: IGame1024Tile[]): boolean {
    for (let i = 0; i < this.size - 1; i++) {
      if (array[i].value > 0 && array[i + 1].value === 0) {
        return true;
      }
    }
    return false;
  }

  arrayMoveRight(array: IGame1024Tile[]): void {
    for (let i = 0; i < this.size - 1; i++) {
      if (array[i].value > 0 && array[i + 1].value === 0) {
        array[i + 1].value = array[i].value;
        array[i].value = 0;
        this.movedOrMerged = true;
      }
    }
  }

  arrayMergeRight(array: IGame1024Tile[]): void {
    for (let i = this.size - 1; i > 0; i--) {
      if (array[i].value > 0 && array[i].value === array[i - 1].value) {
        array[i].value *= 2;
        array[i - 1].value = 0;
        this.movedOrMerged = true;
      }
    }
    this.arrayMoveRight(array);
  }

  makeTempArrayToRightBasedOnDirectionAndIndex(direction: string, index: number): IGame1024Tile[] {
    let tempArray: IGame1024Tile[] = [];

    if (direction === "right") {
      tempArray = this.gameField[index]
    }
    if (direction === "left") {
      tempArray = this.gameField[index].reverse()
    }
    if (direction === "up") {
      for (let i = 0; i < this.size; i++) {
        tempArray.push(this.gameField[i][index])
      }
      tempArray = tempArray.reverse()
    }
    if (direction === "down") {
      for (let i = 0; i < this.size; i++) {
        tempArray.push(this.gameField[i][index])
      }
    }
    return tempArray;
  }

  switchFromRightTempArrayToGameFieldBasedOnDirectionAndIndex(direction: string, index: number, tempArray: IGame1024Tile[]): void {
    if (direction === "right") {
      this.gameField[index] = tempArray
    }
    if (direction === "left") {
      this.gameField[index] = tempArray.reverse()
    }
    if (direction === "up") {
      tempArray = tempArray.reverse()
      for (let i = 0; i < this.size; i++) {
        this.gameField[i][index] = tempArray[i]
      }
    }
    if (direction === "down") {
      for (let i = 0; i < this.size; i++) {
        this.gameField[i][index] = tempArray[i]
      }
    }
  }

  isLost(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.gameField[i][j].value === 0) {
          return false;
        }
      }
    }
    if (this.canMergeAtRow() || this.canMergeAtColumn()) {
      return false;
    }
    return true;
  }

  isWon(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.gameField[i][j].value === 1024) {
          return true;
        }
      }
    }
    return false;
  }

  reset(): void {
    this.gameStatus = 'reset';
    setTimeout(() => { this.gameStatus = 'playing'; }, 500);
    this.gameField = [];
    this.movedOrMerged = false;
    this.generateBoard();
    this.moveCount = 0;
    this.addRandomNumber();
    this.addRandomNumber();
  }

  canMergeAtRow(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.gameField[i][j].value == this.gameField[i][j + 1].value) {
          return true;
        }
      }
    }
    return false;
  }

  canMergeAtColumn(): boolean {
    for (let i = 0; i < this.size - 1; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.gameField[i][j].value == this.gameField[i + 1][j].value) {
          return true;
        }
      }
    }
    return false;
  }

  getBiggestNumber(): number {
    let biggestNumber: number = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.gameField[i][j].value > biggestNumber) {
          biggestNumber = this.gameField[i][j].value;
        }
      }
    }
    return biggestNumber;
  }

  debugClick(event: MouseEvent, x: number, y: number): void {
    if (event.shiftKey) {
      this.gameField[x][y].value === 0 ? this.gameField[x][y].value = 1 : this.gameField[x][y].value *= 2;
    }
  }

  //

  dispatchKeyboardEvent(key: string): void {
    const event = new KeyboardEvent('keydown', { key });
    const event2 = new KeyboardEvent('keyup', { key });
    document.dispatchEvent(event);
    setTimeout(() => document.dispatchEvent(event2), 100);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent3(event: KeyboardEvent) {
    switch (event.key) {
      case 'w': this.releaseKey("up"); break;
      case 's': this.releaseKey("down"); break;
      case 'a': this.releaseKey("left"); break;
      case 'd': this.releaseKey("right"); break;
    }
  }

  pressKey(key: string): void {
    switch (key) {
      case 'up': this.isUpPressed = true; break;
      case 'down': this.isDownPressed = true; break;
      case 'left': this.isLeftPressed = true; break;
      case 'right': this.isRightPressed = true; break;
    }
  }

  releaseKey(key: string): void {
    switch (key) {
      case 'up': this.isUpPressed = false; break;
      case 'down': this.isDownPressed = false; break;
      case 'left': this.isLeftPressed = false; break;
      case 'right': this.isRightPressed = false; break;
    }
  }


}
