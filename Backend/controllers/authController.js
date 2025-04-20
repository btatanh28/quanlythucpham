const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Đăng ký người dùng
exports.register = async (req, res) => {
    const { IDUser, TenNguoiDung, MatKhau, Email, SoDienThoai, DiaChi, VaiTro } = req.body;

    if (!TenNguoiDung || !MatKhau || !Email || !SoDienThoai) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    try {
        const [existingUser] = await db.query('SELECT IDUser FROM User WHERE IDUser = ?', [IDUser]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'IDUser đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(MatKhau, 10);
        await db.query(
            'INSERT INTO User (IDUser, TenNguoiDung, MatKhau, Email, SoDienThoai, DiaChi, VaiTro) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [IDUser, TenNguoiDung, hashedPassword, Email, SoDienThoai, DiaChi || null, VaiTro || 'Nhân Viên']
        );

        res.status(201).json({ message: 'Đăng ký thành công', email: Email });
    } catch (error) {
        console.error('Lỗi trong register:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Đăng ký khách hàng
exports.registerClient = async (req, res) => {
    const { TenKhachHang, MatKhau, Email, SoDienThoai, DiaChi } = req.body;

    if (!TenKhachHang || !MatKhau || !Email || !SoDienThoai) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    try {
        console.log('➡️ Dữ liệu nhận được:', req.body);

        const [existingEmail] = await db.query('SELECT Email FROM KhachHang WHERE Email = ?', [Email]);
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const [existingPhone] = await db.query('SELECT SoDienThoai FROM KhachHang WHERE SoDienThoai = ?', [SoDienThoai]);
        if (existingPhone.length > 0) {
            return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(MatKhau, 10);

        await db.query(
            `INSERT INTO KhachHang (TenKhachHang, MatKhau, Email, SoDienThoai, DiaChi, VaiTro)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [TenKhachHang, hashedPassword, Email, SoDienThoai, DiaChi || null, 'Khách Hàng']
        );

        console.log('✅ Đăng ký khách hàng thành công:', Email);
        res.status(201).json({ message: 'Đăng ký thành công', email: Email });
    } catch (error) {
        console.error('❌ Lỗi trong registerClient:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { Email, MatKhau } = req.body;

    if (!Email || !MatKhau) {
        return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    }

    try {
        let user = null;
        let userType = null;
        
        // Truy vấn người dùng từ bảng User
        let [userRow] = await db.query('SELECT * FROM User WHERE Email = ?', [Email]);
        console.log("userRow:", userRow); // Debugging

        if (userRow.length > 0) {
            user = userRow[0];
            userType = 'User';
        } else {
            // Nếu không tìm thấy, truy vấn người dùng từ bảng KhachHang
            const [khachHangRow] = await db.query('SELECT * FROM KhachHang WHERE Email = ?', [Email]);
            console.log("khachHangRow:", khachHangRow); // Debugging
            if (khachHangRow.length > 0) {
                user = khachHangRow[0];
                userType = 'KhachHang';
            }
        }

        // Kiểm tra nếu không tìm thấy người dùng hoặc mật khẩu không đúng
        if (!user || !user.MatKhau) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra mật khẩu bằng bcrypt
        const validPassword = await bcrypt.compare(MatKhau, user.MatKhau);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo payload cho JWT
        const tokenPayload = {
            id: userType === 'User' ? user.IDUser : user.IDKhachHang,
            email: user.Email,
            userType: userType,
            role: userType === 'User' ? user.VaiTro : 'Khách Hàng'
        };

        // Tạo token JWT
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Trả về token và thông tin người dùng
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            userType: userType,
            role: userType === 'User' ? user.VaiTro : 'Khách Hàng'
        });
    } catch (error) {
        // Log chi tiết lỗi
        console.error('Lỗi trong login:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


