import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';

const DELAY: number = 500;

const routes: Routes = [
  {
    path: '', // default route
    redirectTo: 'main-page',
    pathMatch: 'full'
  },
  {
    path: "main-page",
    component: MainPageComponent
  },

  {
    path: 'minesweeper',
    loadChildren: () => import('./games/minesweeper/minesweeper.module').then(m => m.MinesweeperModule)
  },
  {
    path: 'blocks',
    loadChildren: () => import('./games/blocks/blocks.module').then(m => m.BlocksModule)
    // loadChildren: () => loadWithDelay('blocks', 'BlocksModule', DELAY)
  },
  {
    path: 'game1024',
    loadChildren: () => import('./games/game1024/game1024.module').then(m => m.Game1024Module)
    // loadChildren: () => loadWithDelay('game1024', 'Game1024Module', DELAY)
  },
  {
    path: 'tetris',
    loadChildren: () => import('./games/tetris/tetris.module').then(m => m.TetrisModule)
    // loadChildren: () => loadWithDelay('tetris', 'TetrisModule', DELAY)
  },
  {
    path: 'tetris2',
    loadChildren: () => import('./games/tetris2/tetris2.module').then(m => m.Tetris2Module)
    // loadChildren: () => loadWithDelay('tetris', 'TetrisModule', DELAY)
  },
];


// 
function loadWithDelay(modulePath: string, module: string, delay: number): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('./games/' + modulePath + '/' + modulePath + '.module').then(m => m[module])), delay);
  });
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
