import { Component, inject } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import { ThemeButton } from '../theme-button/theme-button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeButton],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private navbarService = inject(NavbarService);
  
  get isExpanded() {
    return this.navbarService.isExpanded();
  }
  
  toggleSidebar() {
    this.navbarService.toggle();
  }
}