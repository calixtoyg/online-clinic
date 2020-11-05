import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {TestComponent} from './components/test/test.component';

const routes: Routes = [
  {path: 'welcome', component: WelcomeComponent},
  {path: 'test', component: TestComponent},
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
