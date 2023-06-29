import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'minesweeper',
    // loadChildren: () => import('./games/minesweeper/minesweeper.module').then(m => m.MinesweeperModule)
    loadChildren: () => new Promise(resolve => {
      setTimeout(() => resolve(import('./games/minesweeper/minesweeper.module').then(m => m.MinesweeperModule)), 2000);
    })
  },
  {
    path: 'blocks',
    // loadChildren: () => import('./games/blocks/blocks.module').then(m => m.BlocksModule)
    loadChildren: () => new Promise(resolve => {
      setTimeout(() => resolve(import('./games/blocks/blocks.module').then(m => m.BlocksModule)), 2000);
    })
  },
  {
    path: 'game1024',
    // loadChildren: () => import('./games/game1024/game1024.module').then(m => m.Game1024Module)
    loadChildren: () => new Promise(resolve => {
      setTimeout(() => resolve(import('./games/game1024/game1024.module').then(m => m.Game1024Module)), 2000);
    })
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
