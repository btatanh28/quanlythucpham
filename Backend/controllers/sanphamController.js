const db = require('../config/db');

// Hàm tạo ID cho sản phẩm (36 ký tự)
function generateIDSanPham() {
    const timestamp = Date.now().toString(36); // Chuyển thời gian thành base36
    const randomStr = Math.random().toString(36).substring(2, 15); // Chuỗi ngẫu nhiên
    const combined = (timestamp + randomStr).padEnd(36, '0'); // Đảm bảo đủ 36 ký tự
    return combined.substring(0, 36); // Cắt nếu vượt quá
}

// Lấy tất cả sản phẩm
exports.getAllSanPham = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM SanPham');
        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Lấy chi tiết sản phẩm theo ID
exports.getSanPhamById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM SanPham WHERE IDSanPham = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Thêm sản phẩm mới
exports.createSanPham = async (req, res) => {
    const { IDUser, TenSanPham, SoTonKho, HinhAnh, Gia, MoTa } = req.body;
    if (!TenSanPham || !Gia || SoTonKho < 0 || Gia < 0) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
    }

    const IDSanPham = generateIDSanPham();  // Sử dụng hàm tùy chỉnh

    try {
        await db.execute(
            'INSERT INTO SanPham (IDSanPham, IDUser, TenSanPham, SoTonKho, HinhAnh, Gia, MoTa) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [IDSanPham, IDUser || null, TenSanPham, SoTonKho || 0, HinhAnh || null, Gia, MoTa || null]
        );
        res.status(201).json({ message: 'Thêm sản phẩm thành công', IDSanPham });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Cập nhật sản phẩm
exports.updateSanPham = async (req, res) => {
    const { id } = req.params;
    const { IDUser, TenSanPham, SoTonKho, HinhAnh, Gia, MoTa } = req.body;

    if (!TenSanPham || !Gia || SoTonKho < 0 || Gia < 0) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
    }

    try {
        const [result] = await db.execute(
            'UPDATE SanPham SET IDUser = ?, TenSanPham = ?, SoTonKho = ?, HinhAnh = ?, Gia = ?, MoTa = ? WHERE IDSanPham = ?',
            [IDUser || null, TenSanPham, SoTonKho || 0, HinhAnh || null, Gia, MoTa || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Xóa sản phẩm
exports.deleteSanPham = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM SanPham WHERE IDSanPham = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

exports.kiemTraTonKho = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT SoTonKho FROM SanPham WHERE IDSanPham = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.json({ SoTonKho: rows[0].SoTonKho });
    } catch (error) {
        console.error('Lỗi khi kiểm tra tồn kho:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
