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

  speedDisplay: string = "";

  constructor(private tetris2Service: Tetris2Service) { }

  ngOnInit(): void {
    this.setSpeedDisplay();
  }

  isGameStarted(): boolean {
    return this.tetris2Service.getGameStarted();
  }

  rotate() {
    this.tetris2Service.rotateCurrentTetromino();
  }

  addSpeed() {
    this.tetris2Service.increaseGameSpeed();
    this.setSpeedDisplay();
  }

  removeSpeed() {
    this.tetris2Service.decreaseGameSpeed();
    this.setSpeedDisplay();
  }

  setSpeedDisplay() {
    let speedNumber: number = this.tetris2Service.getGameSpeed() / 100;
    let speed = 11 - speedNumber;
    this.speedDisplay = speed.toString().padStart(2, '0');
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

  getPaused(): boolean {
    return this.tetris2Service.getPaused();
  }

  getPausedText(): string {
    return this.getPaused() ? 'play_arrow' : 'pause';
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

  getScore(): number {
    return this.tetris2Service.score;
  }
  getScoreMultiplier(): number {
    return this.tetris2Service.scoreMultiplier;
  }
  getLastScore(): number {
    return this.tetris2Service.lastScore;
  }
  getDebugMode(): boolean {
    return this.tetris2Service.debugMode;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
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
