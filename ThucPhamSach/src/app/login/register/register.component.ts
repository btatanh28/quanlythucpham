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
    styleUrl: './register.component.css'
})

export class RegisterComponent{
    registerForm = { TenKhachHang: '', Email: '', MatKhau: '', SoDienThoai: '', DiaChi: '', ConfirmPassword: '' };

    constructor(private authService: AuthService, private router: Router){}

    onRegisterSubmit(){
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

                this.router.navigate(['/home']);
            },
            error(err){
                console.error('Lỗi:', err);
                alert('Đăng ký thất bại: ' + (err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại')); 
            }
        })
    }
}