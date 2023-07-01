import { Component } from '@angular/core';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss']
})
export class TetrisComponent {

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
    }
  ];

  currentBlockPosition: any[][] = [];


  currentBlock: any = this.tetrisBlocks[1];

  constructor() {
    this.generateBoard();
    this.putBlock();
    this.tetrisField[0][0] = 1;
    this.tetrisField[1][8] = 1;
    this.tetrisField[5][4] = 1;
    this.refreshBoard();
    this.checkIfCanMove('left');
    this.startGame();
  }

  generateBoard(): void {
    for (let i = 0; i <= 20; i++) {
      this.tetrisField.push([]);
      for (let j = 0; j <= 10; j++) {
        this.tetrisField[i].push(0);

      }
    }
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



  putBlock(): void {
    this.currentBlockPosition = [];
    for (let i = 0; i < this.currentBlock.shape.length; i++) {
      this.currentBlockPosition.push([]);
      for (let j = 0; j < this.currentBlock.shape[i].length; j++) {
        if (this.currentBlock.shape[i][j] > 0) {
          this.currentBlockPosition[i].push([i, j + 4]);
        } else {
          this.currentBlockPosition[i].push([i, null]);
        }
      }
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

        if (lastBlockPosition === 10) {
          canMove = false;
          break
        }

        if (this.currentBlockPosition[i][0][0] < 20) {
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
        if (this.currentBlockPosition[i][0][0] < 20) {
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
          if (last[0] === 20) {
            this.putBlockTimer();
            canMove = false;
            break
          }
          if (this.tetrisField[last[0] + 1][last[1]] > 0) {
            this.putBlockTimer();
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
      }
    }

    this.checkIfCanMove('down');

    this.refreshBoard();
  }

  randomizeCurrentBlock(): void {
    this.currentBlock = this.tetrisBlocks[Math.floor(Math.random() * this.tetrisBlocks.length)];
  }

  getClass(cell: number): string {
    switch (cell) {
      case 0:
        return 'empty';
      case 1:
        return 'block1';
      case 2:
        return 'block2';
      default:
        return 'empty';
    }
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


  placeCurrentBlock(): void {
    for (let i = 0; i < this.currentBlockPosition.length; i++) {
      for (let j = 0; j < this.currentBlockPosition[i].length; j++) {
        if (this.currentBlockPosition[i][j][1] != null) {
          this.tetrisField[this.currentBlockPosition[i][j][0]][this.currentBlockPosition[i][j][1]] = this.currentBlock.number;
        }
      }
    }
  }


  putBlockTimer(): void {
    console.log("putBlockTimer")
    let timer = setInterval(() => {
      if (this.checkIfCanMove('down')) {
        clearInterval(timer);
      } else {
        this.randomizeCurrentBlock();
        this.putBlock();
        this.refreshBoard();
      }
    }, 1000)

  }

  startGame(): void {
    setInterval(() => {
      this.move('down');
    }, 1000)
  }

}


