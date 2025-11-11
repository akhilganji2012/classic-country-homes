import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from '../app/navbar/navbar';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone:false,
  template: `
    <app-navbar></app-navbar>
    <main class="main-container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-container { padding: 16px; max-width: 1200px; margin: 0 auto; }
  `]
})
export class App {}
