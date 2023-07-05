import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tetris2GameComponent } from './tetris2-game/tetris2-game.component';


const routes: Routes = [
  {
    path: '',
    component: Tetris2GameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tetris2Module {}
