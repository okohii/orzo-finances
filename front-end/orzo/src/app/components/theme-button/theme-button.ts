import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-button',
  imports: [MatIconModule],
  templateUrl: './theme-button.html',
  styleUrl: './theme-button.css'
})
export class ThemeButton {
  constructor(private themeService: ThemeService) { }

  alternarTema() {
    this.themeService.toggleTheme();
  }

  temaAtual() {
    return this.themeService.getTheme();
  }
}