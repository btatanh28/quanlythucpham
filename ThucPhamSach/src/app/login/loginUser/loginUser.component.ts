import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../services/authService";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

@Component({
    selector: "app-loginUser",
    imports: [ CommonModule, FormsModule, HttpClientModule ],
    templateUrl: './loginUser.component.html',
    styleUrl: './loginUser.component.css'
})

export class LoginUserComponent{
    loginForm = { Email: '', MatKhau: '' };

    constructor(private authService: AuthService, private router: Router){}
    
    onLoginSubmit() {
        const user = {
            Email: this.loginForm.Email,
            MatKhau: this.loginForm.MatKhau
        };
    
        this.authService.login(user).subscribe({
            next: (response) => {
                console.log('Phản hồi đăng nhập:', response);
                localStorage.setItem('Current', JSON.stringify({
                    email: user.Email, 
                    role: response.role
                }));
                localStorage.setItem('Token', response.token);
    
                if(this.authService.getUserCurrent()){
                    if (this.authService.isAdmin()) {
                        console.log("role:", response.role);
                        alert(`Đăng nhập thành công vs quyền ${response.role}`)
                        this.router.navigate(['manager']);
                    } else {
                        alert(`Đăng nhập thành công với vai trò ${response.role}`)
                        this.router.navigate(['/product']);
                    }
                }
            },
            error: (err) => {
                console.error('Lỗi:', err);
                alert('Đăng nhập thất bại: ' + (err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại')); 
            }
        });
    } 
}