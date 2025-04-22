import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/authService";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

@Component({
    selector: "app-register",
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm = { TenKhachHang: '', Email: '', MatKhau: '', SoDienThoai: '', DiaChi: '', ConfirmPassword: '' };

    constructor(private authService: AuthService, private router: Router) {}

    onRegisterSubmit() {
        const user = {
            Email: this.registerForm.Email, 
            TenKhachHang: this.registerForm.TenKhachHang, 
            MatKhau: this.registerForm.MatKhau, 
            SoDienThoai: this.registerForm.SoDienThoai, 
            DiaChi: this.registerForm.DiaChi 
        }

        console.log('Dữ liệu gửi đi:', user);

        this.authService.registerClient(user).subscribe({
            next: (response) => {
                alert("Đăng ký tài khoản thành công");

                // Sau khi đăng ký thành công, gọi đăng nhập với thông tin vừa tạo
                const loginData = {
                    Email: this.registerForm.Email, 
                    MatKhau: this.registerForm.MatKhau
                };

                this.authService.login(loginData).subscribe({
                    next: (loginResponse) => {
                        console.log('Đăng nhập thành công:', loginResponse);
                        // Chuyển hướng tới trang sản phẩm sau khi đăng nhập thành công
                        this.router.navigate(['/product']);
                    },
                    error: (err) => {
                        console.error('Lỗi đăng nhập:', err);
                        alert('Đăng nhập thất bại: ' + (err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại'));
                    }
                });
            },
            error(err) {
                console.error('Lỗi đăng ký:', err);
                alert('Đăng ký thất bại: ' + (err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại')); 
            }
        });
    }
}
