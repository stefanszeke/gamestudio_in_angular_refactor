import { Injectable } from '@angular/core';
import { Tetromino } from '../tetris2-model/Tetromino';
import { TETROMINOS_DATA, shapeName } from '../tetris2-model/TetrominosShapes';
import { interval, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Tetris2Service {
  grid!: { value: number, placed: boolean }[][];
  currentTetromino!: Tetromino;
  gameStarted: boolean = false;

  private readonly DEFAULT_X_POSITION = 4;
  private readonly DEFAULT_Y_POSITION = 0;

  gameSpeed: number = 200;

  currentPosition: { x: number, y: number };

  constructor() {
    this.currentPosition = { x: this.DEFAULT_X_POSITION, y: this.DEFAULT_Y_POSITION };
    this.generateGrid();
    console.log("grid: ", this.grid)
  }

  setRandomTetromino() {
    this.currentTetromino = this.getRandomTetromino();
  }

  generateGrid() {
    this.grid = [];
    for (let i = 0; i < 20; i++) {
      this.grid.push([]);
      for (let j = 0; j < 10; j++) {
        this.grid[i].push({ value: 0, placed: false });
      }
    }
  }

  getRandomTetromino() {
    let randomShapeName: shapeName = TETROMINOS_DATA[Math.floor(Math.random() * TETROMINOS_DATA.length)].name;
    return new Tetromino(randomShapeName);
  }

  refreshCurrentTetromino() {
    for (let y = 0; y < this.currentTetromino.shape.length; y++) {
      for (let x = 0; x < this.currentTetromino.shape[y].length; x++) {
        if (this.currentTetromino.shape[y][x] !== 0) {
          console.log('place')
          this.grid[this.currentPosition.y + y][this.currentPosition.x + x].value = TETROMINOS_DATA.find(tetromino => tetromino.name === this.currentTetromino.name)!.blockNumber;
        }
      }
    }
  }

  refreshPlaceAndSpawnNew() {
    this.refreshCurrentTetromino
    this.placeCurrentTetromino();
    this.spawnNewRandomTetromino();

  }

  moveCurrentTetrominoDown() {
    this.clearCurrentTetromino();
    this.currentPosition.y++;
    this.refreshCurrentTetromino();
  }

  checkIfCanMoveDown(): boolean {
    let canMoveDown = true;
    for (let y = 0; y < this.currentTetromino.shape.length; y++) {
      for (let x = 0; x < this.currentTetromino.shape[y].length; x++) {
        let blockValue = this.currentTetromino.shape[y][x]
        if (blockValue > 0) {

          // check if block is at the bottom of the grid
          if (this.currentPosition.y + y >= this.grid.length - 1) {
            return false;
          }

          // check if block is above another placed block
          let gridBlockBellow = this.grid[this.currentPosition.y + y + 1][this.currentPosition.x + x]
          if (gridBlockBellow.value > 0 && gridBlockBellow.placed) {
            return false;
          }

        }
      }
    }
    return canMoveDown;
  }

  spawnNewRandomTetromino() {
    this.setRandomTetromino();
    this.resetPosition();
    this.refreshCurrentTetromino();
  }

  rotateCurrentTetromino() {
    if (this.currentTetromino === null) {
      return;
    }
    this.clearCurrentTetromino();
    this.currentTetromino.rotate();
    this.refreshCurrentTetromino();
  }

  clearCurrentTetromino() {
    for (let y = 0; y < this.currentTetromino.shape.length; y++) {
      for (let x = 0; x < this.currentTetromino.shape[y].length; x++) {
        if (this.currentTetromino.shape[y][x] !== 0) {
          this.grid[this.currentPosition.y + y][this.currentPosition.x + x].value = 0;
        }
      }
    }
  }

  choseAndPlaceTetromino(shapeName: shapeName) {
    if (this.currentTetromino === null) {
      return;
    }


    this.clearCurrentTetromino();
    this.currentTetromino.shape = TETROMINOS_DATA.find(tetromino => tetromino.name === shapeName)!.shape;
    this.currentTetromino.name = shapeName;
    this.resetPosition();
    this.refreshCurrentTetromino();
  }

  placeCurrentTetromino() {
    // for (let y = 0; y < this.currentTetromino.shape.length; y++) {
    //   for (let x = 0; x < this.currentTetromino.shape[y].length; x++) {
    //     if (this.currentTetromino.shape[y][x] !== 0) {
    //       this.grid[this.currentPosition.y + y][this.currentPosition.x + x].placed = true;
    //     }
    //   }
    // }

    this.currentTetromino.shape.map((row, y) => {
      row.map((value, x) => {
        if (value !== 0) {
          this.grid[this.currentPosition.y + y][this.currentPosition.x + x].placed = true;
        }
      })
    })
  }

  resetPosition() {
    this.currentPosition = { x: this.DEFAULT_X_POSITION, y: this.DEFAULT_Y_POSITION };
    if (this.currentTetromino!.name === "I") {
      this.currentPosition = { x: this.DEFAULT_X_POSITION - 1, y: this.DEFAULT_Y_POSITION - 1 };
    }
  }

  startMainGameLoop() {
    if (this.gameStarted) {
      return;
    }

    this.gameStarted = true;

    interval(this.gameSpeed)
      .pipe(
        takeWhile(() => !this.isGameOver())
      )
      .subscribe(() => {
        if (this.checkIfCanMoveDown()) {
          this.moveCurrentTetrominoDown();
        } else {
          this.refreshPlaceAndSpawnNew()
        }
      })
  }

  isGameOver(): boolean {
    return false;
  }

}
