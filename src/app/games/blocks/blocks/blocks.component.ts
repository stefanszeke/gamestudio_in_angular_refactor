import { Component } from '@angular/core';
import { BlocksTile, BlocksTileColor } from '../blocks-model/BlocksTile';
import { GameStatus } from '../../model/GameStatus';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent {
  board: BlocksTile[][] = []
  rows: number = 5;
  cols: number = 15;

  emptyColumnIndex: number = -1;
  lastEmptyColumnIndex: number = this.cols-1;

  status: GameStatus = "playing"

  score: number = 0;
  adjacentScoreCount: number = 0;


  // constructor(private store: Store) {}

  ngOnInit(): void {
    this.generateBoard();
    // this.store.dispatch(setCurrentGame({game: 'Blocks'}));
    // this.store.dispatch(RatingActions.loadRating({game: 'Blocks'}));
    // this.store.dispatch(ScoreActions.loadTopScoresByGame({game: 'Blocks'}));
    // this.store.dispatch(CommentActions.loadComments({game: 'Blocks'}));
  }


  generateBoard(): void {
    for (let i = 0; i < this.rows; i++) {
      this.board.push([]);
      for (let j = 0; j < this.cols; j++) {
        this.board[i].push({ color: this.getRandomColor()});
      }
    }
  }

  getRandomColor(): BlocksTileColor {
    let color = Math.floor(Math.random() * 4);
    switch(color) {
      case 0:
        return 'red';
      case 1:
        return 'green';
      case 2:
        return 'blue';
      case 3:
        return 'yellow';
    }
    return null;
  }

  tryToClearBlock(x: number, y: number): void {
    if(this.hasSameAdjacentAndNotNull(x, y)) {
      this.clearBlock(x, y);
    }
    while(this.hasEmptyColumn()) {
      this.moveEmptyLeft();
  }
    if(this.hasNoMoreMoves()) {

      this.status = "won";
      // this.store.dispatch(ScoreActions.postScore({score: {game: 'Blocks',player:"player", points: this.score}}));
    }
  
  }

  clearBlock(x: number, y: number):void {
      let color: BlocksTileColor = this.board[x][y].color;
      this.board[x][y].color = null;
      this.clearAdjacentBlock(x, y, color);

      do {
          this.turnOnGravity();
      } while (this.hasFloatingBlocks());



      this.handleScore();
  } 

  public clearAdjacentBlock(row: number, column: number, color: BlocksTileColor): void {
    const adjacent: number[][] = [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]];
  
    for (const adj of adjacent) {
      if (adj[0] >= 0 && adj[0] < this.rows && adj[1] >= 0 && adj[1] < this.cols) {
        if (this.board[adj[0]][adj[1]].color === color) {
          this.clearBlock(adj[0], adj[1]);
          this.adjacentScoreCount++;
        }
      }
    }
  }

  public handleScore(): void {
    const scoreExponent = 1.6;
    const newScore: number = Math.floor(Math.pow(this.adjacentScoreCount*10, scoreExponent));
    this.score += newScore;
    this.adjacentScoreCount = 0;
  }

  public hasFloatingBlocks():boolean {
    for(let i = 1; i < this.rows; i++) {
        for(let j = 0; j < this.cols; j++) {
            if(this.board[i][j].color == null) {
                if( this.board[i-1][j].color != null ) {
                    return true;
                }
            }

        }
    }
    return false;
  }

  public turnOnGravity():void {
    for(let i = 0;i < this.rows-1; i++) {
        for(let j = 0; j < this.cols; j++) {
            if(this.board[i+1][j].color == null) {
                // copy to empty block
                this.board[i+1][j].color = this.board[i][j].color;
                // set old blocks null
                this.board[i][j].color = null;
            }
        }
    }
  }
  public hasEmptyColumn(): boolean {
    let lastRow: number = this.rows-1;
    let columns: number = this.lastEmptyColumnIndex;
    for(let i = 0; i < columns; i++) {
        if(this.board[lastRow][columns-1-i].color == null) {
            this.emptyColumnIndex = columns-1-i;
            return true;
        }
    }
    return false;
  }

  public moveEmptyLeft(): void  {
    for(let i = this.emptyColumnIndex+1; i <= this.lastEmptyColumnIndex; i++) {
        for(let j = 0; j < this.rows; j++) {
            this.board[j][i-1].color = this.board[j][i].color;
        }
    }
    this.clearLastColumn();
    this.lastEmptyColumnIndex--;
  }

  private clearLastColumn(): void {
    for(let i = 0; i < this.rows; i++) {
      this.board[i][this.lastEmptyColumnIndex].color = null;
    }
  }

  public  hasSameAdjacentAndNotNull(row: number, column: number): boolean {
    if(this.board[row][column].color == null) {
        return false;
    }
    const adjacent: number[][] = [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]];

    for(let adj of adjacent) {
        if( (adj[0] >= 0 && adj[0] < this.rows) && (adj[1] >= 0 && adj[1] < this.cols) ) {
            if( this.board[adj[0]][adj[1]].color == this.board[row][column].color )
                return true;
        }
    }
    return false;
  }

  public hasNoMoreMoves(): boolean {
    for(let i = 0; i < this.rows; i++) {
        for(let j = 0; j < this.cols; j++) {
            if(this.hasSameAdjacentAndNotNull(i,j)) {
                return false;
            }
        }
    }
    return true;
  }

  resetGame(): void {
    this.board = [];
    this.score = 0;
    this.status = "playing";
    this.generateBoard();
    this.emptyColumnIndex = -1;
    this.lastEmptyColumnIndex = this.cols-1;
  }
}
