import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('orzo');
  constructor(private themeService: ThemeService) {}

  alternarTema() {
    this.themeService.toggleTheme();
  }

  temaAtual() {
    return this.themeService.getTheme();
  }
}
