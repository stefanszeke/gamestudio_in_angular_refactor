import { Component } from '@angular/core';
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


}
