import { Component, OnInit } from '@angular/core';
import { SanPhamService, SanPham } from '../../services/productService';
import { HttpClientModule } from '@angular/common/http'; // 👈 Thêm dòng này
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-admin-products',
    imports: [CommonModule, FormsModule, NgIf, NgFor, HttpClientModule ],
    templateUrl: './productAdmin.component.html',
    styleUrl: './productAdmin.component.css'
})
export class ProductAdminComponent implements OnInit {
    products: SanPham[] = [];
    newProduct: SanPham = {
        TenSanPham: '',
        Gia: 0,
        HinhAnh: 'assets/.jpg',
        SoTonKho: 0,
        MoTa: '',
        IDUser: null
    };
    editingProduct: boolean = false;
    editingId: string | null = null;

    constructor(private sanPhamService: SanPhamService) {}

    ngOnInit() {
        this.loadProducts();
    }

    // Tải danh sách sản phẩm
    loadProducts() {
        this.sanPhamService.getSanPhams().subscribe({
            next: (data) => {
                this.products = data;
            },
            error: (error) => {
                console.error('Lỗi khi tải sản phẩm:', error);
                alert('Không thể tải danh sách sản phẩm!');
            }
        });
    }

    // Lưu sản phẩm (thêm hoặc sửa)
    saveProduct() {
        if (!this.newProduct.TenSanPham || this.newProduct.Gia <= 0 || !this.newProduct.HinhAnh) {
            alert('Vui lòng nhập đầy đủ thông tin hợp lệ!');
            return;
        }

        if (this.editingProduct && this.editingId) {
            // Sửa sản phẩm
            this.sanPhamService.updateSanPham(this.editingId, this.newProduct).subscribe({
                next: () => {
                    this.loadProducts();
                    this.resetForm();
                    alert('Cập nhật sản phẩm thành công!');
                },
                error: (error) => {
                    console.error('Lỗi khi sửa sản phẩm:', error);
                    alert(error.message);
                }
            });
        } else {
            // Thêm sản phẩm
            this.sanPhamService.createSanPham(this.newProduct).subscribe({
                next: () => {
                    this.loadProducts();
                    this.resetForm();
                    alert('Thêm sản phẩm thành công!');
                },
                error: (error) => {
                    console.error('Lỗi khi thêm sản phẩm:', error);
                    alert(error.message);
                }
            });
        }
    }

    // Sửa sản phẩm
    editProduct(product: SanPham) {
        this.newProduct = { ...product };
        this.editingProduct = true;
        this.editingId = product.IDSanPham || null;
    }

    // Xóa sản phẩm
    deleteProduct(id: string) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            this.sanPhamService.deleteSanPham(id).subscribe({
                next: () => {
                    this.loadProducts();
                    alert('Xóa sản phẩm thành công!');
                },
                error: (error) => {
                    console.error('Lỗi khi xóa sản phẩm:', error);
                    alert(error.message);
                }
            });
        }
    }

    // Hủy sửa
    cancelEdit() {
        this.resetForm();
    }

    // Reset form
    private resetForm() {
        this.newProduct = {
            TenSanPham: '',
            Gia: 0,
            HinhAnh: 'assets/.jpg',
            SoTonKho: 0,
            MoTa: '',
            IDUser: null
        };
        this.editingProduct = false;
        this.editingId = null;
    }
}