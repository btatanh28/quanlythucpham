import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Định nghĩa interface SanPham
export interface SanPham {
    IDSanPham?: string;
    IDUser?: string | null;
    TenSanPham: string;
    SoTonKho?: number;
    HinhAnh?: string;
    Gia: number;
    MoTa?: string;
    TrangThai?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SanPhamService {
    private apiUrl = 'http://localhost:5000/api/sanpham';

    constructor(private http: HttpClient){}

    // Lấy danh sách sản phẩm
    getSanPhams(): Observable<SanPham[]> {
        return this.http.get<SanPham[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    // Lấy sản phẩm theo ID
    getSanPhamById(id: string): Observable<SanPham> {
        return this.http.get<SanPham>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    // Thêm sản phẩm
    createSanPham(sanpham: SanPham): Observable<any> {
        return this.http.post<any>(this.apiUrl, sanpham).pipe(
            catchError(this.handleError)
        );
    }

    // Sửa sản phẩm
    updateSanPham(id: string, sanpham: SanPham): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, sanpham).pipe(
            catchError(this.handleError)
        );
    }

    // Xóa sản phẩm
    deleteSanPham(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    kiemTraTonKho(id: string): Observable<number> {
        return this.http.get<{ SoTonKho: number }>(`${this.apiUrl}/sanpham/${id}/tontonkho`)
          .pipe(map(res => res.SoTonKho));
    }

    // Xử lý lỗi
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Đã xảy ra lỗi!';
        if (error.error instanceof ErrorEvent) {
            // Lỗi phía client
            errorMessage = error.error.message;
        } else {
            // Lỗi phía server
            errorMessage = error.error.message || `Mã lỗi: ${error.status}, thông báo: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }
}