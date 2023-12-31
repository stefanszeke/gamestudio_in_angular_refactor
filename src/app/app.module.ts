import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { MinesweeperComponent } from './games/minesweeper/minesweeper/minesweeper.component';
import { minesweeperTileComponent } from './games/minesweeper/minesweeper-tile/minesweeper-tile.component';
import { BlocksComponent } from './games/blocks/blocks/blocks.component';
import { BlocksTileComponent } from './games/blocks/blocks-tile/blocks-tile.component';
import { Game1024Component } from './games/game1024/game1024/game1024.component';
import { Game1024TileComponent } from './games/game1024/game1024-tile/game1024-tile.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { TetrisComponent } from './games/tetris/tetris/tetris.component';
import { Tetris2GameComponent } from './games/tetris2/tetris2-game/tetris2-game.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MinesweeperComponent,
    minesweeperTileComponent,
    BlocksComponent,
    BlocksTileComponent,
    Game1024Component,
    Game1024TileComponent,
    MainPageComponent,
    TetrisComponent,
    Tetris2GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
