import { Component } from '@angular/core';
import { Tile, TileStatus } from '../minesweeper-model/Tile';
import { GameStatus } from '../../model/GameStatus';
import { Score } from 'src/model/Score';
import { TimerData, TimerService } from 'src/app/services/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss']
})
export class MinesweeperComponent {
  size: number = 10;
  mineCount: number = 8;
  board: Tile[][] = [];

  sizeControl: number = this.size;
  mineControl: number = this.mineCount;

  status: GameStatus = 'paused';

  // @ViewChild(TimerComponent) timerComponent: any;
  timerData: TimerData = { display: '00m:00s.000ms', milliseconds: 0 };
  timeSubscription?: Subscription;

  score: number = 0;
  scoreSubmitted: boolean = false;



  // constructor(private store: Store) {}
  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.initBoard();
    // this.store.dispatch(setCurrentGame({game: 'Minesweeper'}));
    // this.store.dispatch(RatingActions.loadRating({game: 'Minesweeper'}));
    // this.store.dispatch(ScoreActions.loadTopScoresByGame({game: 'Minesweeper'}));
    // this.store.dispatch(CommentActions.loadComments({game: 'Minesweeper'}));
  }


  changeSize(numb: number): void {
    if (this.sizeControl + numb > 4 && this.sizeControl + numb <= 17) {
      this.sizeControl += numb;
    }
    let maxMines = this.sizeControl * this.sizeControl - 1;
    if (this.mineControl > maxMines) {
      this.mineControl = maxMines;
    }
  }

  changeMineCount(numb: number): void {
    let maxMines = this.sizeControl * this.sizeControl - 1;
    if (this.mineControl + numb >= 2 && this.mineControl + numb <= maxMines) {
      this.mineControl += numb;
    }
  }

  setNewBoard(): void {
    this.size = this.sizeControl;
    this.mineCount = this.mineControl;
    this.resetGame();
  }

  initBoard(): void {
    this.generateBoard();
    this.generateMines();
    this.generateClues();
  }


  // timer
  setTime($event: string): void { this.timerData.display = $event; }
  startTime(): void { this.timerService.startTimer(); }
  pauseTime(): void { this.timerService.pauseTimer(); }
  resetTime(): void { this.timerService.resetTimer(); }

  setScore() {
    this.score = (this.size + this.size) * this.mineCount - Math.floor(this.timerData.milliseconds / 1000);
  }

  showScore() {
    this.setScore();
    console.log(this.score);
  }

  resetGame(): void {
    this.board = [];
    this.status = 'reset';
    this.resetTime();
    setTimeout(() => { this.status = 'paused'; }, 500);
    this.scoreSubmitted = false;
    this.initBoard();
  }

  startGame(): void {
    this.status = 'playing';
    this.startTime();
    this.timeSubscription = this.timerService.getTimer().subscribe((data: TimerData) => {
      this.timerData = data;
    });
  }

  openTile(x: number, y: number): void {
    if (this.status === 'paused') {
      this.startGame();
    }
    const tile = this.board[x][y];
    if (tile.status !== 'flagged') {
      tile.status = 'visible';
      if (tile.value === '0') {
        this.openAdjacentTiles(x, y);
      }

      if (tile.value === '💣') {
        this.status = 'lost';
        this.pauseTime();
        this.revealMines();
      } else if (this.isSolved()) {
        this.status = 'won';
        this.setScore();
        this.pauseTime();
        this.markAllMines();

        if (!this.scoreSubmitted) { // check if score is already submitted, otherwise it will be submitted multiple times, because of the recursive call of openAdjacentTiles()
          this.submitScore();
        }

      }
    }
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  submitScore(): void {
    const newScore: Score = { game: 'Minesweeper', player: "frontend_player", points: this.score };
    // this.store.dispatch(ScoreActions.postScore({score: newScore}));
    this.scoreSubmitted = true;
  }


  placeFlag(e: Event, x: number, y: number): void {
    e.preventDefault();
    const tile = this.board[x][y];
    if (tile.status === 'hidden') {
      if (this.countTilesByStatus('flagged') < this.mineCount) {
        tile.status = 'flagged';
      }
    } else if (tile.status === 'flagged') (
      tile.status = 'hidden'
    )

  }

  isSolved(): boolean {
    return this.size * this.size - this.countTilesByStatus('visible') === this.mineCount;
  }

  countTilesByStatus(status: TileStatus): number {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].status === status) {
          count++;
        }
      }
    }
    return count;
  }

  generateBoard(): void {
    for (let i = 0; i < this.size; i++) {
      this.board.push([]);
      for (let j = 0; j < this.size; j++) {
        this.board[i].push({ value: "0", status: "hidden" });
      }
    }
  }

  generateMines(): void {
    let mines = 0;
    while (mines < this.mineCount) {
      let x = Math.floor(Math.random() * this.size);
      let y = Math.floor(Math.random() * this.size);
      if (this.board[x][y].value !== "💣") {
        this.board[x][y].value = "💣";
        mines++;
      }
    }
  }

  generateClues(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].value !== "💣") {
          this.board[i][j].value = `${this.countAdjacentMines(i, j)}`;
        }
      }
    }
  }

  countAdjacentMines(x: number, y: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      let actRow = x + i;
      if (actRow >= 0 && actRow < this.size) {
        for (let j = -1; j <= 1; j++) {
          let actCol = y + j;
          if (actCol >= 0 && actCol < this.size) {
            if (this.board[actRow][actCol].value === "💣") {
              count++;
            }
          }
        }
      }
    }
    return count;
  }

  revealMines(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].value === "💣") {
          this.board[i][j].status = "visible";
        }
      }
    }
  }

  markAllMines(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].value === "💣") {
          this.board[i][j].status = "flagged";
        }
      }
    }
  }



  openAdjacentTiles(x: number, y: number): void {
    for (let i = -1; i <= 1; i++) {
      let actRow = x + i;
      if (actRow >= 0 && actRow < this.size) {
        for (let j = -1; j <= 1; j++) {
          let actCol = y + j;
          if (actCol >= 0 && actCol < this.size) {
            if (this.board[actRow][actCol].status === "hidden") {
              this.openTile(actRow, actCol);
            }
          }
        }
      }
    }
  }
}
