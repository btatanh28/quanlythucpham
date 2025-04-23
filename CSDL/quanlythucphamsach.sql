CREATE DATABASE QuanLyDonHang;
USE QuanLyDonHang;

-- Bảng KhachHang
CREATE TABLE KhachHang (
    IDKhachHang INT PRIMARY KEY AUTO_INCREMENT,
    TenKhachHang NVARCHAR(100) NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    SoDienThoai NVARCHAR(20) UNIQUE NOT NULL,
    DiaChi NVARCHAR(255),
    VaiTro ENUM('Khách Hàng') DEFAULT 'Khách Hàng'
);

-- Bảng User (Nhân viên + Quản trị viên)
CREATE TABLE User (
    IDUser NVARCHAR(255) PRIMARY KEY,
    TenNguoiDung NVARCHAR(100) NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    SoDienThoai NVARCHAR(20) NOT NULL,
    DiaChi NVARCHAR(255),
    VaiTro ENUM('Admin', 'Nhân Viên') DEFAULT 'Nhân Viên'
);

-- Bảng SanPham
CREATE TABLE SanPham (
    IDSanPham CHAR(36) PRIMARY KEY,
    IDUser NVARCHAR(255),
    TenSanPham NVARCHAR(100) NOT NULL UNIQUE,
    SoTonKho INT NOT NULL DEFAULT 0 CHECK (SoTonKho >= 0),
    HinhAnh NVARCHAR(255),
    Gia DECIMAL(18,2) NOT NULL CHECK (Gia >= 0),
    MoTa NVARCHAR(500),
    FOREIGN KEY (IDUser) REFERENCES User(IDUser) ON DELETE CASCADE
);

-- Bảng DonHang
CREATE TABLE DonHang (
    IDDonHang INT PRIMARY KEY AUTO_INCREMENT,
    IDKhachHang INT NOT NULL,
    TongTien DECIMAL(18,2) NOT NULL CHECK (TongTien >= 0),
	TrangThaiSanPham ENUM('Đang xử lý', 'Hết hàng', 'Hoàn trả', 'Đã giao') DEFAULT 'Đang xử lý',
    HinhThucThanhToan ENUM('Thanh toán khi nhận hàng', 'Thanh toán chuyển khoản') DEFAULT 'Thanh toán khi nhận hàng',
    FOREIGN KEY (IDKhachHang) REFERENCES KhachHang(IDKhachHang) ON DELETE CASCADE
);

-- Bảng CTDonHang
CREATE TABLE CTDonHang (
    IDChiTiet INT PRIMARY KEY AUTO_INCREMENT,
    IDDonHang INT NOT NULL,
    IDSanPham CHAR(36) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Gia DECIMAL(18,2) NOT NULL CHECK (Gia >= 0),
    TongTien DECIMAL(18,2) GENERATED ALWAYS AS (Quantity * Gia) STORED,
    FOREIGN KEY (IDDonHang) REFERENCES DonHang(IDDonHang) ON DELETE CASCADE,
    FOREIGN KEY (IDSanPham) REFERENCES SanPham(IDSanPham) ON DELETE CASCADE
);



select * from User;
select * from KhachHang;
select * from SanPham;
select * from DonHang;
select * from CTDonHang;