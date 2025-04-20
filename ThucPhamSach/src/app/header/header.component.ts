import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isScrolled = false;
  searchQuery: string = '';


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Animation states
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

  onSearch() {
    if (this.searchQuery.trim()) {
      alert(`Tìm kiếm: ${this.searchQuery}`); // Thay bằng logic tìm kiếm thực tế
      this.searchQuery = ''; // Reset sau khi tìm kiếm
    }
  }
}