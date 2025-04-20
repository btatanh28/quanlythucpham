import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/authService';
import { Router } from '@angular/router'; // Thêm import Router


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isScrolled = false;
  searchQuery: string = '';

  constructor (private authService: AuthService,
    private router: Router
  ){}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  logoState = 'normal';
  menuItemStates: { [key: string]: string } = {};

  onLogoHover() {
    this.logoState = 'hover';
  }

  onLogoLeave() {
    this.logoState = 'normal';
  }

  onMenuItemHover(item: string) {
    this.menuItemStates[item] = 'hover';
  }

  onMenuItemLeave(item: string) {
    this.menuItemStates[item] = 'normal';
  }
  logOut(){
    this.authService.logOut();
    this.router.navigate(['/login']); 
  }
}