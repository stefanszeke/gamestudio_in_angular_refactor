import { Injectable } from '@angular/core';
import { Tetromino } from '../tetris2-model/Tetromino';
import { TETROMINOS_DATA, TetrisMoves, shapeName } from '../tetris2-model/TetrominosShapes';
import { Subject, Subscription, delay, interval, switchMap, takeWhile, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Tetris2Service {
  grid!: { value: number, placed: boolean }[][];
  currentTetromino!: Tetromino;
  TetrominoQueue!: Tetromino[];

  gameLoop$: Subject<void>;
  gameLoopSubscription: Subscription | null = null;

  gameStarted: boolean = false;
  gamePaused: boolean = false;
  gameOver: boolean = false;

  private readonly DEFAULT_X_POSITION = 4;
  private readonly DEFAULT_Y_POSITION = 0;

  gameSpeed: number = 200;

  score: number = 0;
  scoreMultiplier: number = 1;
  lastScore: number = 0;

  currentPosition: { x: number, y: number };

  constructor() {
    this.currentPosition = { x: this.DEFAULT_X_POSITION, y: this.DEFAULT_Y_POSITION };
    this.generateGrid();
    this.debug();
    this.TetrominoQueue = [];
    this.gameLoop$ = new Subject<void>();
  }

  startGame(): void {
    this.addRandomTetrominoToQueue();
    this.addRandomTetrominoToQueue();
    this.addRandomTetrominoToQueue();
  }

  setRandomTetromino(): void {
    this.currentTetromino = this.getRandomTetromino();
  }

  setTetrominoFromQueue(): void {
    this.currentTetromino = this.getTetrominoFromQueue();
  }

  getTetrominoFromQueue(): Tetromino {
    return this.TetrominoQueue.shift()!;
  }

  addRandomTetrominoToQueue(): void {
    this.TetrominoQueue.push(this.getRandomTetromino());
  }

  spawnNewTetrominoFromQueue(): void {
    this.setTetrominoFromQueue();
    this.resetPosition();
    this.refreshCurrentTetromino();
    this.addRandomTetrominoToQueue();
  }

  getTetrominoQueue(): Tetromino[] {
    return this.TetrominoQueue;
  }

  getTetrominoNumber(name: shapeName): number {
    return TETROMINOS_DATA.find(tetromino => tetromino.name === name)!.blockNumber
  }

  getPaused(): boolean {
    return this.gamePaused;
  }


  generateGrid(): void {
    this.grid = [];
    for (let i = 0; i < 20; i++) {
      this.grid.push([]);
      for (let j = 0; j < 10; j++) {
        this.grid[i].push({ value: 0, placed: false });
      }
    }
  }

  resetGrid(): void {
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        this.grid[i][j].value = 0;
        this.grid[i][j].placed = false;
      }
    }
  }

  getRandomTetromino(): Tetromino {
    let randomShapeName: shapeName = TETROMINOS_DATA[Math.floor(Math.random() * TETROMINOS_DATA.length)].name;
    return new Tetromino(randomShapeName);
  }

  refreshCurrentTetromino(): void {
    for (let y = 0; y < this.currentTetromino.shape.length; y++) {
      for (let x = 0; x < this.currentTetromino.shape[y].length; x++) {
        if (this.currentTetromino.shape[y][x] !== 0) {
          if (this.grid[this.currentPosition.y + y][this.currentPosition.x + x].placed) {
            this.gameOver = true;
          }
          this.grid[this.currentPosition.y + y][this.currentPosition.x + x].value = TETROMINOS_DATA.find(tetromino => tetromino.name === this.currentTetromino.name)!.blockNumber;
        }
      }
    }
  }

  refreshPlaceAndSpawnNew(): void {
    this.refreshCurrentTetromino
    this.placeCurrentTetromino();
    this.spawnNewTetrominoFromQueue();

  }

  moveCurrentTetromino(direction: TetrisMoves): void {
    if(this.gameOver) return;
    if (this.canMove(direction)) {
      this.clearCurrentTetromino();
      switch (direction) {
        case TetrisMoves.LEFT: this.currentPosition.x--; break;
        case TetrisMoves.RIGHT: this.currentPosition.x++; break;
        case TetrisMoves.DOWN: this.currentPosition.y++; break;
      }
      this.refreshCurrentTetromino();
    }
  }

  canMove(direction: TetrisMoves) {
    let canMove = true;

    for (let y = 0; y < this.currentTetromino.shape.length; y++) {
      for (let x = 0; x < this.currentTetromino.shape[y].length; x++) {
        let blockValue = this.currentTetromino.shape[y][x]
        if (blockValue > 0) {

          let conditionBorder: boolean;
          let newPosition;

          switch (direction) {
            case TetrisMoves.LEFT:
              conditionBorder = this.currentPosition.x + x <= 0;
              newPosition = { x: this.currentPosition.x + x - 1, y: this.currentPosition.y + y };
              break;
            case TetrisMoves.RIGHT:
              conditionBorder = this.currentPosition.x + x >= this.grid[0].length - 1;
              newPosition = { x: this.currentPosition.x + x + 1, y: this.currentPosition.y + y };
              break;
            case TetrisMoves.DOWN:
              conditionBorder = this.currentPosition.y + y >= this.grid.length - 1;
              newPosition = { x: this.currentPosition.x + x, y: this.currentPosition.y + y + 1 };
              break;
          }

          if (conditionBorder! || (this.grid[newPosition!.y][newPosition!.x].value > 0 && this.grid[newPosition!.y][newPosition!.x].placed)) {
            return false;
          }

        }
      }
    }
    return canMove;
  }

  spawnNewRandomTetromino(): void {
    this.setRandomTetromino();
    this.resetPosition();
    this.refreshCurrentTetromino();
  }

  rotateCurrentTetromino(): void {
    let rotatedTetromino = new Tetromino(this.currentTetromino.name, this.currentTetromino.IRotated);
    rotatedTetromino.shape = this.currentTetromino.shape;
    rotatedTetromino.rotate();

    if (!this.isCollision(rotatedTetromino)) {
      this.clearCurrentTetromino();
      this.currentTetromino.rotate();
      this.refreshCurrentTetromino();
    }

  }

  isCollision(tetromino: Tetromino): boolean {
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x] !== 0) {
          if (this.currentPosition.x + x < 0 || this.currentPosition.x + x > 9) {
            return true;
          }

          if (this.currentPosition.y + y < 0 || this.currentPosition.y + y > 19) {
            return true;
          }

          if (this.grid[this.currentPosition.y + y][this.currentPosition.x + x].placed) {
            return true;
          }
        }
      }
    }
    return false;
  }

  clearCurrentTetromino(): void {
    for (let y = 0; y < this.currentTetromino.shape.length; y++) {
      for (let x = 0; x < this.currentTetromino.shape[y].length; x++) {
        if (this.currentTetromino.shape[y][x] !== 0) {
          this.grid[this.currentPosition.y + y][this.currentPosition.x + x].value = 0;
        }
      }
    }
  }

  choseAndPlaceTetromino(shapeName: shapeName): void {
    this.clearCurrentTetromino();
    this.currentTetromino.shape = TETROMINOS_DATA.find(tetromino => tetromino.name === shapeName)!.shape;
    this.currentTetromino.name = shapeName;
    this.resetPosition();
    this.refreshCurrentTetromino();
  }

  placeCurrentTetromino(): void {
    this.currentTetromino.shape.map((row, y) => {
      row.map((value, x) => {
        if (value !== 0) {
          this.grid[this.currentPosition.y + y][this.currentPosition.x + x].placed = true;
        }
      })
    })
  }

  async checkCompletedRowsAndClear3(): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let clearedRows = 0;
        for (let i = 0; i < this.grid.length; i++) {

          let rowIndex = this.grid.length - 1 - i;


          let rowFull: boolean = this.grid[rowIndex].every(block => block.placed);
          let rowEmpty: boolean = this.grid[rowIndex].every(block => !block.placed);

          if (rowFull) {
            this.grid[rowIndex].map(block => { block.placed = false; block.value = 0 });
            clearedRows++;
          }

          if (rowEmpty) {
            break;
          }
        }
        resolve(clearedRows);
      }, 100)
    })
  }

  async fallRows3(fallTimes: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let i = 0; i < this.grid.length - 1; i++) {

          let currentIndex = this.grid.length - 1 - i;
          let aboveIndex = this.grid.length - 2 - i;

          let rowCurrentEmpty: boolean = this.grid[currentIndex].every(block => !block.placed);
          let rowAboveNotEmpty: boolean = this.grid[aboveIndex].some(block => block.placed);


          if (rowCurrentEmpty && rowAboveNotEmpty) {
            this.grid[currentIndex + fallTimes - 1].forEach((block, index) => {
              block.placed = this.grid[aboveIndex][index].placed;
              block.value = this.grid[aboveIndex][index].value;
            });
            this.grid[aboveIndex].map(block => { block.placed = false; block.value = 0 });
          }
        }
      }, 100)
      resolve();
    })
  }

  async checkCompletedRowsAndClear(): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let lastRow = -1;
        let rowsCleared = 0;
        for (let i = 0; i < this.grid.length; i++) {

          let rowIndex = this.grid.length - 1 - i;

          let rowFull: boolean = this.grid[rowIndex].every(block => block.placed);
          let rowEmpty: boolean = this.grid[rowIndex].every(block => !block.placed);

          if (rowFull) {
            this.grid[rowIndex].map(block => { block.placed = false; block.value = 0 });
            if(lastRow === -1)  lastRow = rowIndex;
            rowsCleared++;
          }

          if (rowEmpty) {
            break;
          }

        }
        const scoreToAdd = (rowsCleared * rowsCleared) * this.scoreMultiplier * 10;
        this.score += scoreToAdd;
        this.lastScore = scoreToAdd;
        console.log("score+: ",scoreToAdd)
        this.scoreMultiplier = rowsCleared === 0 ? 1 : this.scoreMultiplier+1;
        resolve(lastRow!);
      }, 100)
    })
  }
  async fallRows(lastRow: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let i = lastRow; i > 0 - 1; i--) {
          if(this.grid[i].some(block => block.placed)) {
            this.grid[lastRow] = this.grid[i].map(block => ({ ...block, placed: block.placed, value: block.value }));

            this.grid[i] = this.grid[i].map(block => ({ ...block, placed: false, value: 0 }));
            lastRow--;
          }
        }
      }, 100)
      resolve();
    })
  }

  debug() {
    for (let i = 0; i < 9; i++) {
      this.grid[19][i].placed = true;
      this.grid[19][i].value = 1;
      this.grid[18][i].placed = true;
      this.grid[18][i].value = 1;
      this.grid[17][i].placed = true;
      this.grid[17][i].value = 1;
      this.grid[16][i].placed = true;
      this.grid[16][i].value = 1;
    }

    this.grid[15][1].placed = true;
    this.grid[15][1].value = 1;
    this.grid[17][1].placed = false;
    this.grid[17][1].value = 0;

    this.grid[19][1].placed = false;
    this.grid[19][1].value = 0;
  }

  resetPosition(): void {
    this.currentPosition = { x: this.DEFAULT_X_POSITION, y: this.DEFAULT_Y_POSITION };
    if (this.currentTetromino!.name === "I") {
      this.currentPosition = { x: this.DEFAULT_X_POSITION - 1, y: this.DEFAULT_Y_POSITION - 1 };
    }
  }



  startMainGameLoop(): void {
    if (this.gameStarted) {
      return;
    }

    this.startGame();
    console.log(this.TetrominoQueue)
    this.spawnNewTetrominoFromQueue();

    this.gameStarted = true;
    this.gamePaused = false;

    this.gameLoopSubscription = this.gameLoop$
      .pipe(
        switchMap(() => interval(this.gameSpeed)
          .pipe(
            takeWhile(() => !this.gameOver && !this.gamePaused)
          )
        )
      )
      .subscribe(async () => {
        if (this.canMove(TetrisMoves.DOWN)) {
          this.moveCurrentTetromino(TetrisMoves.DOWN)
        } else {

          this.refreshPlaceAndSpawnNew()

          const clearedRows = await this.checkCompletedRowsAndClear();
          if (clearedRows > 0) await this.fallRows(clearedRows);

        }
      });

    this.gameLoop$.next();
  }


  pauseOrResumeGame(): void {
    this.gamePaused = !this.gamePaused;
    if (!this.gamePaused) {
      this.gameLoop$.next();
    }
  }

  resetGame(): void {
    this.gameStarted = false;
    this.gameOver = false;
    this.gamePaused = true;
    this.gameLoopSubscription?.unsubscribe();
    this.gameLoop$ = new Subject<void>();
    this.TetrominoQueue = [];
    this.score = 0;
    this.scoreMultiplier = 1;
    this.lastScore = 0;
    this.resetGrid();
  }

  ngOnDestroy(): void {
    this.gameLoopSubscription?.unsubscribe();
  }

}


// 0000 - 0000 - 0000 - 0000
// 0000 - 0000 - 0000 - 0000
// 0000 - 0000 - 0000 - 0000
// 0010 - 0010 - 0000 - 0000  
// 1111 - 0000 - 0010 - 0000
// 0001 - 0001 - 0000 - 0010
// 1111 - 0000 - 0001 - 0001
// 1110 - 1110 - 1110 - 1110

// 0000 - 0000 - 0000 - 0000
// 0022 - 0022 - 0022 - 0022
// 0022 - 0022 - 0022 - 0022
// 1111 - 0000 - 0000 - 0000
// 0022 - 0022 - 0022 - 0000
// 0022 - 0022 - 0000 - 0000
// 1111 - 0000 - 0000 - 0022
// 1111 - 0000 - 0022 - 0022
// 0022 - 0022 - 0022 - 0022


// 10**2 = 100
// 20**2 = 400
// 30**2 = 900
// 40**2 = 1600