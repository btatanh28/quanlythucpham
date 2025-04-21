import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginUser',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './loginUser.component.html',
  styleUrls: ['./loginUser.component.css']
})
export class LoginUserComponent {
  loginForm = { Email: '', MatKhau: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit() {
    const user = {
      Email: this.loginForm.Email,
      MatKhau: this.loginForm.MatKhau
    };

    this.authService.login(user).subscribe({
      next: (response) => {
        console.log('Phản hồi đăng nhập:', response);
        const currentUser = this.authService.getUserCurrent();
        if (currentUser) {
          if (this.authService.isAdmin()) {
            console.log('Role:', currentUser.role);
            alert(`Đăng nhập thành công với quyền ${currentUser.role}`);
            this.router.navigate(['manager']);
          } else {
            alert(`Đăng nhập thành công với vai trò ${currentUser.role}`);
            this.router.navigate(['/product']);
          }
        } else {
          console.error('Không lấy được thông tin người dùng sau đăng nhập');
          alert('Đăng nhập thất bại: Không lấy được thông tin người dùng');
        }
      },
      error: (err) => {
        console.error('Lỗi:', err);
        alert('Đăng nhập thất bại: ' + (err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại'));
      }
    });
  }
}