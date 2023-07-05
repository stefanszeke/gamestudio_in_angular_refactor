import { Component } from '@angular/core';
import { Tetromino } from '../tetris2-model/Tetromino';
import { Tetris2Service } from '../tetris2-service/tetris2.service';
import { shapeName } from '../tetris2-model/TetrominosShapes';

@Component({
  selector: 'app-Tetris2-game',
  templateUrl: './tetris2-game.component.html',
  styleUrls: ['./tetris2-game.component.scss']
})
export class Tetris2GameComponent {
  public grid = this.tetris2Service.grid;

  constructor(private tetris2Service: Tetris2Service) { }

  ngOnInit(): void {
    this.tetris2Service.spawnNewRandomTetromino();
  }

  rotate() {
    this.tetris2Service.rotateCurrentTetromino();
  }

  replaceCurrentTetromino(shapeName: shapeName) {
    this.tetris2Service.choseAndPlaceTetromino(shapeName);
  }

  moveDown() {
    this.tetris2Service.moveCurrentTetrominoDown();
  }

  lock() {
    this.tetris2Service.placeCurrentTetromino();
    this.tetris2Service.spawnNewRandomTetromino();
  }
  
  start() {
    this.tetris2Service.startMainGameLoop();
  }


}
