import { NgModule } from '@angular/core';
import { Game1024Component } from './game1024/game1024.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: Game1024Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Game1024Module { }
