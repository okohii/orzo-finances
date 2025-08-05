import { Component, inject } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import { ThemeButton } from '../theme-button/theme-button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeButton, RouterModule, MatIconModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private navbarService = inject(NavbarService);

  navItemsClass = 'nav-items';
  
  get isExpanded() {
    return this.navbarService.isExpanded();
  }
  
  toggleSidebar() {
    if (this.isExpanded) {
      setTimeout(() => this.navItemsClass = 'nav-items collapsing', 100);
    } else {
      this.navItemsClass = 'nav-items';
    }
    this.navbarService.toggle();
  }
}