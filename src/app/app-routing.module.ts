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
    loadChildren: () => loadWithDelay('blocks', 'BlocksModule', DELAY)
  },
  {
    path: 'game1024',
    loadChildren: () => loadWithDelay('game1024', 'Game1024Module', DELAY)
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
