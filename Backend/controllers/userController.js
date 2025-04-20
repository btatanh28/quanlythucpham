const db = require('../db');

// Get All Users
exports.getAllUsers = (req, res) => {
    const query = 'SELECT * FROM User';
    
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
};

// Get User by ID
exports.getUserById = (req, res) => {
    const query = 'SELECT * FROM User WHERE IDUser = ?';
    
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(result[0]);
    });
};

// Update User
exports.updateUser = (req, res) => {
    const { TenNguoiDung, MatKhau, Email, SoDienThoai, DiaChi } = req.body;
    
    // Validate required fields
    if (!TenNguoiDung || !MatKhau || !Email || !SoDienThoai) {
        return res.status(400).json({ message: 'TenNguoiDung, MatKhau, Email, and SoDienThoai are required' });
    }

    const query = 'UPDATE User SET TenNguoiDung = ?, MatKhau = ?, Email = ?, SoDienThoai = ?, DiaChi = ? WHERE IDUser = ?';
    
    db.query(query, [TenNguoiDung, MatKhau, Email, SoDienThoai, DiaChi || null, VaiTro || 'Nhân Viên', req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User updated successfully' });
    });
};

// Delete User
exports.deleteUser = (req, res) => {
    const query = 'DELETE FROM User WHERE IDUser = ?';
    
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
};