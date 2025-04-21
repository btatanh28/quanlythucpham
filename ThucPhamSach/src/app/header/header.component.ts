import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  currentUser: any = null;
  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Is logged in:', this.authService.isLoggedIn());
    this.currentUser = this.authService.getUserCurrent();
    console.log('Initial currentUser:', this.currentUser);

    this.authService.currentUser$.subscribe(user => {
      console.log('CurrentUser$ emitted:', user);
      this.currentUser = user;
    });
  }

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

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}