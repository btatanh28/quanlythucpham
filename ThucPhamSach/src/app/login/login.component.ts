import { Component, HostListener } from "@angular/core";
import { LoginUserComponent } from "./loginUser/loginUser.component";
import { RegisterComponent } from "./register/register.component";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf } from "@angular/common";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [LoginUserComponent, RegisterComponent, NgIf, CommonModule, HttpClientModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export class LoginComponent{
    activeTab: 'login' | 'register' = 'login';
    isScrolled = false;

    @HostListener('window:scroll', [])
    onWindowScroll() {
      this.isScrolled = window.pageYOffset > 50;
    }

    setActiveTab(tab: 'login' | 'register') {
        this.activeTab = tab;
    }
}