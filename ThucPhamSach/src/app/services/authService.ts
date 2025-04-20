import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})

export class AuthService{
    private apiUrl = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient){}

    private validateInput(data: any): boolean{
        if(!data || !data.Email || !data.MatKhau){
            throw new Error("Email và Mật khẩu không được để trống")
        }
        return true;
    }

    login(user: {Email: string; MatKhau: string}): Observable<any>{
        this.validateInput(user);
        return this.http.post(`${this.apiUrl}/login`,user).pipe(
            tap((response: any) => {
                if(response.token && response.Email){
                    localStorage.setItem('Token', response.token);
                }
            }),
            // catchError(this.handleError)
        );
    }

    register(users: {IDUser: string; TenNguoiDung: string; MatKhau: string; Email: string; DiaChi: string; SoDienThoai: string}): Observable<any>{
        if(!users.IDUser || !users.TenNguoiDung || !users.MatKhau || !users.Email){
            throw new Error("Thông tin phải được điền đầy đủ")
        }
        return this.http.post(`${this.apiUrl}/register`, users);
    }

    registerClient(customer: {TenKhachHang: string; MatKhau: string; Email: string; DiaChi: string; SoDienThoai: string}): Observable<any>{
        if(!customer.TenKhachHang || !customer.MatKhau || !customer.Email || !customer.SoDienThoai){
            throw new Error("Thông tin phải được điền đầy đủ")
        }
        return this.http.post(`${this.apiUrl}/registerClient`, customer,{
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
    }

    isAdmin(): boolean {
        const currentUserStr = localStorage.getItem('Current');
        if (!currentUserStr) return false;

        try {
            const currentUser = JSON.parse(currentUserStr);
            return currentUser?.role === 'Admin' || currentUser?.role === 'admin';
        } catch (error) {
            console.error('Lỗi khi parse Current user:', error);
            return false;
        }  
    }

    getUserCurrent(): any{
        const user =  localStorage.getItem('Current');
        console.log("User: ", user);
        return user ? JSON.parse(user): null;
    }

    getToken(): string | null{
        return localStorage.getItem('Token');
    }

    logOut(): void{
        localStorage.removeItem('Token');
        localStorage.removeItem('Current');
    }
}