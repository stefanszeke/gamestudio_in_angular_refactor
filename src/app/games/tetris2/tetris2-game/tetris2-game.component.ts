import { Component, HostListener } from '@angular/core';
import { Tetromino } from '../tetris2-model/Tetromino';
import { Tetris2Service } from '../tetris2-service/tetris2.service';
import { TetrisMoves, shapeName } from '../tetris2-model/TetrominosShapes';

@Component({
  selector: 'app-Tetris2-game',
  templateUrl: './tetris2-game.component.html',
  styleUrls: ['./tetris2-game.component.scss']
})
export class Tetris2GameComponent {
  public grid = this.tetris2Service.grid;

  constructor(private tetris2Service: Tetris2Service) { }

  ngOnInit(): void {

  }

  rotate() {
    this.tetris2Service.rotateCurrentTetromino();
  }

  replaceCurrentTetromino(shapeName: shapeName) {
    this.tetris2Service.choseAndPlaceTetromino(shapeName);
  }

  move(direction: string) {
    switch (direction) {
      case 'left': { this.tetris2Service.moveCurrentTetromino(TetrisMoves.LEFT); break; }
      case 'right': { this.tetris2Service.moveCurrentTetromino(TetrisMoves.RIGHT); break; }
      case 'down': { this.tetris2Service.moveCurrentTetromino(TetrisMoves.DOWN); break; }
    }
  }

  lock() {
    this.tetris2Service.placeCurrentTetromino();
    this.tetris2Service.spawnNewRandomTetromino();
  }

  clear() {
    this.tetris2Service.checkCompletedRowsAndClear();
  }

  start() {
    this.tetris2Service.startMainGameLoop();
  }

  pause() {
    this.tetris2Service.pauseOrResumeGame();
  }

  reset() {
    this.tetris2Service.resetGame();
  }

  getQueue(): Tetromino[] {
    return this.tetris2Service.getTetrominoQueue();
  }

  getTetrominoNumber(name: shapeName): number {
    return this.tetris2Service.getTetrominoNumber(name);
  }

  getQueueCellClass(name: shapeName, cell: number) {
    if(cell > 0) {
      let cellNumber = this.tetris2Service.getTetrominoNumber(name);
      return `cell-${cellNumber}`;
    }
    return '';
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {

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
        this.rotate();
    }
  }

}
