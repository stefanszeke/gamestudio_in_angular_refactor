import { Component } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss']
})
export class TetrisComponent {

  private gameInterval: any;
  public gameOver: boolean = false;
  public score: number = 0;

  tetrisField: any[][] = [];
  tetrisBlocks: any[] = [
    {
      shape: [
        [1, 1],
        [1, 1]
      ],
      number: 1
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
      ],
      number: 2
    },
    {
      shape: [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      number: 3
    },
    {
      shape: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      number: 4
    },
    {
      shape: [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      number: 5
    },
    {
      shape: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      number: 6
    },
    {
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      number: 7
    }
  ];

  currentBlockPosition: any[][] = [];


  currentBlock: any = this.tetrisBlocks[1];

  constructor() {
    this.generateBoard();
    this.randomizeCurrentBlock();
    this.putBlock(this.createBlock(this.currentBlock.shape, 0, 4));

    this.debugGenerateBoard();

    this.refreshBoard();
    this.startGame();
  }

  generateBoard(): void {
    for (let i = 0; i < 20; i++) {
      this.tetrisField.push([]);
      for (let j = 0; j < 10; j++) {
        this.tetrisField[i].push(0);

      }
    }
  }

  debugGenerateBoard(): void {

    for (let i = 0; i < 8; i++) {
      this.tetrisField[19][i] = 1;
      this.tetrisField[18][i] = 1;
    }
    this.tetrisField[16][5] = 1;
    this.tetrisField[16][6] = 1;
    this.tetrisField[16][7] = 1;

    this.tetrisField[17][5] = 1;
    this.tetrisField[17][6] = 1;
    this.tetrisField[17][7] = 1;
  }

  refreshBoard(): void {
    for (let i = 0; i < this.currentBlockPosition.length; i++) {
      for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
        if (this.currentBlockPosition[i][j][1] != null) {
          this.tetrisField[this.currentBlockPosition[i][j][0]][this.currentBlockPosition[i][j][1]] = this.currentBlock.number
        }
      }
    }
  }



  createBlock(shape: number[][], startingRow: number, startingCol: number): any[][] {
    let newBlock: any[][] = [];
    for (let i = 0; i < this.currentBlock.shape.length; i++) {
      newBlock.push([]);
      for (let j = 0; j < this.currentBlock.shape[i].length; j++) {
        if (this.currentBlock.shape[i][j] > 0) {
          newBlock[i].push([i + startingRow, j + startingCol]);
        } else {
          newBlock[i].push([i + startingRow, null]);
        }
      }
    }
    return newBlock;
  }

  putBlock(block: any[][]) {
    if(!this.checkCollision(block)) {
      this.currentBlockPosition = block;
    } else {
      this.pauseGame();
      this.gameOver = true;
      console.log("game over");

    }
  }

  checkIfCanMove(direction: string): boolean {
    let canMove: boolean = true;

    if (direction === 'right') {
      for (let i = 0; i < this.currentBlockPosition.length; i++) {
        let lastBlockPosition = this.currentBlockPosition[i][0];
        for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
          if (this.currentBlockPosition[i][j][1] != null) {
            lastBlockPosition = this.currentBlockPosition[i][j][1];
          }
        }

        if (lastBlockPosition === 9) {
          canMove = false;
          break
        }

        if (this.currentBlockPosition[i][0][0] < 19) {
          if (this.tetrisField[this.currentBlockPosition[i][0][0]][lastBlockPosition + 1] > 0) {
            canMove = false;
          }
        }
      }
    }

    if (direction === 'left') {
      for (let i = 0; i < this.currentBlockPosition.length; i++) {
        let firstBlockPosition;
        for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
          if (this.currentBlockPosition[i][j][1] != null) {
            firstBlockPosition = this.currentBlockPosition[i][j][1];
            break;
          }
        }

        if (firstBlockPosition === 0) {
          canMove = false;
          break
        }
        if (this.currentBlockPosition[i][0][0] < 19) {
          if (this.tetrisField[this.currentBlockPosition[i][0][0]][firstBlockPosition - 1] > 0) {
            canMove = false;
          }
        }

      }
    }

    if (direction === 'down') {
      for (let i = 0; i < this.currentBlockPosition[0].length; i++) {
        let last = null;
        for (let j = 0; j < this.currentBlockPosition.length; j++) {
          if (this.currentBlockPosition[j][i][1] != null) {
            last = this.currentBlockPosition[j][i];
          }
        }

        if (last != null) {
          if (last[0] === 19) {
            console.log("test1");
            // this.putBlockTimer(1000);
            canMove = false;
            break
          }
          if (this.tetrisField[last[0] + 1][last[1]] > 0) {
            console.log("test2");
            // this.putBlockTimer(1000);
            canMove = false;
          }
        }
      }
    }

    return canMove;
  }



  move(direction: string): void {
    if (direction === 'right') {
      if (this.checkIfCanMove('right')) {
        for (let i = 0; i < this.currentBlockPosition.length; i++) {
          for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
            if (this.currentBlockPosition[i][j][1] != null) {
              this.tetrisField[this.currentBlockPosition[i][j][0]][this.currentBlockPosition[i][j][1]] = 0;
              this.currentBlockPosition[i][j][1] += 1;
            }
          }
        }
      }
    }
    if (direction === 'left') {
      if (this.checkIfCanMove('left')) {
        for (let i = 0; i < this.currentBlockPosition.length; i++) {
          for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
            if (this.currentBlockPosition[i][j][1] != null) {
              this.tetrisField[this.currentBlockPosition[i][j][0]][this.currentBlockPosition[i][j][1]] = 0;
              this.currentBlockPosition[i][j][1] -= 1;
            }
          }
        }
      }
    }
    if (direction === 'down') {
      if (this.checkIfCanMove('down')) {
        for (let i = 0; i < this.currentBlockPosition.length; i++) {
          for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
            if (this.currentBlockPosition[i][j] != null) {
              this.tetrisField[this.currentBlockPosition[i][j][0]][this.currentBlockPosition[i][j][1]] = 0;
              this.currentBlockPosition[i][j][0] += 1;
            }
          }
        }
      } else {
        console.log("put block timer 0");
        this.putBlockTimer(0);
      }
    }

    this.checkIfCanMove('down');
    this.refreshBoard();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(this.gameOver) {
      return;
    }
    switch (event.key) {
      case 'ArrowRight':
      case 'd':
        this.move('right');
        break;
      case 'ArrowLeft':
      case 'a':
        this.move('left');
        break;
      case 'ArrowDown':
      case 's':
        this.move('down');
        break;
      case 'ArrowUp':
      case 'w':
        this.rotateBlock();
    }
  }

  randomizeCurrentBlock(): void {
    this.currentBlock = this.tetrisBlocks[Math.floor(Math.random() * this.tetrisBlocks.length)];
  }

  getClass(cell: number): string {
    return `block${cell}`
  }

  getCurrentTopRowPosition(): number {
    return this.tetrisField.length - this.currentBlockPosition.length;
  }

  getLastBlockRow(): number {
    let lastBlockRow: number = 0;
    for (let i = 0; i < this.currentBlockPosition.length; i++) {
      for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
        if (this.currentBlockPosition[i][j] != null) {
          lastBlockRow = i;
        }
      }
    }
    return lastBlockRow;
  }




  putBlockTimer(time: number): void {
    console.log("put block timer");
    if(this.gameOver) {
      return;
    }
    let timer = setInterval(() => {
      if (this.checkIfCanMove('down')) {
        clearInterval(timer);
      } else {
        console.log("put block timer 1");
        this.randomizeCurrentBlock();

        this.pauseGame();
        this.checkCompleteRowsAndDelete();
        this.resumeGame();

        clearInterval(timer);
        this.putBlock(this.createBlock(this.currentBlock.shape, 0, 4));
        this.refreshBoard();
      }
    }, time)
  }

  startGame(): void {
    this.gameInterval = setInterval(() => {
      this.move('down');
    }, 1000)
  }

  pauseGame(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  resumeGame(): void {
    if (!this.gameInterval) {
      this.startGame();
    }
  }

  restartGame(): void {
    this.pauseGame();
    this.gameOver = false;
    this.score = 0;
    this.tetrisField = [];
    this.generateBoard();
    this.randomizeCurrentBlock();
    this.putBlock(this.createBlock(this.currentBlock.shape, 0, 4));
    this.refreshBoard();
    this.startGame();
  }

  checkCompleteRowsAndDelete() {
    let clearedRows: number = 0;

    for (let i = 0; i < this.tetrisField.length; i++) {
      let rowIndex = this.tetrisField.length - 1 - i;
      let rowFull: boolean = false;
      let rowEmpty: boolean = false;

      let counter = 0;
      for (let j = 0; j < this.tetrisField[rowIndex].length; j++) {
        if (this.tetrisField[rowIndex][j] > 0) {
          counter++;
        }
      }

      if (counter === 10) {
        rowFull = true;
        this.clearRow(rowIndex);
        clearedRows++;
      }
      if (counter === 0) {
        rowEmpty = true;
      }
      if (rowEmpty) {
        break;
      }
    }

    if (clearedRows > 0) {
      this.fallBlocks(clearedRows);
      this.score += clearedRows * clearedRows * 10;
    }
  }

  clearRow(row: number): void {
    for (let i = 0; i < this.tetrisField[row].length; i++) {
      this.tetrisField[row][i] = 0;
    }
  }

  fallBlocks(fallTimes: number): void {
    for (let i = 0; i < this.tetrisField.length - 1; i++) {
      let currentIndex = this.tetrisField.length - 1 - i;
      let aboveIndex = this.tetrisField.length - 2 - i;
      let rowSumCurrent: number = this.tetrisField[currentIndex].reduce((a, b) => a + b, 0);
      let rowSumAbove: number = this.tetrisField[aboveIndex].reduce((a, b) => a + b, 0);

      console.log("current index: " + currentIndex);
      console.log("above index: " + aboveIndex);


      if (rowSumCurrent === 0 && rowSumAbove > 0) {
        this.tetrisField[currentIndex + fallTimes - 1] = this.tetrisField[aboveIndex];
        this.tetrisField[aboveIndex] = new Array(10).fill(0);
      }

    }
  }

  checkCollision(block: any[][]): boolean {
    let collision: boolean = false;
    for (let i = 0; i < block.length; i++) {
      for (let j = 0; j < block[i].length; j++) {
        if (block[i][j][1] != null) {
          if (this.tetrisField[block[i][j][0]][block[i][j][1]] > 0) {
            collision = true;
            break;
          }

          if (block[i][j][1] > 9 || block[i][j][1] < 0) {
            collision = true;
            break;
          }

        }
      }
    }
    return collision;
  }

  rotateBlock(): void {

    let startingRow = this.currentBlockPosition[0][0][0];
    let startingCol = this.currentBlockPosition[0][0][1];
    for (let i = 0; i < this.currentBlockPosition.length; i++) {
      for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
        if (startingCol === null) {
          if (this.currentBlockPosition[j][i][1] != null) {
            startingCol = this.currentBlockPosition[j][i][1] - i;
          }
        }
        if (startingCol != null) {
          break;
        }
      }
    }

    for (let i = 0; i < this.currentBlockPosition.length; i++) {
      for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
        if (this.currentBlockPosition[i][j][1] != null) {
          this.tetrisField[this.currentBlockPosition[i][j][0]][this.currentBlockPosition[i][j][1]] = 0;
        }
      }
    }

    let rotatedBlockShape: any[][] = JSON.parse(JSON.stringify(this.currentBlock.shape));
    for (let i = 0; i < this.currentBlock.shape.length; i++) {
      for (let j = 0; j < this.currentBlock.shape[i].length; j++) {
        rotatedBlockShape[i][j] = this.currentBlock.shape[j][this.currentBlock.shape[i].length - 1 - i];
      }
    }

    let rotatedBlock: any[][] = this.createBlock(rotatedBlockShape, startingRow, startingCol);

    if (!this.checkCollision(rotatedBlock)) {

      this.currentBlock.shape = rotatedBlockShape;
      this.putBlock(rotatedBlock);

    }

    this.refreshBoard();
  }

  //123 //369
  //456 //258
  //789 //147




}


