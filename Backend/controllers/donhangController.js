const db = require('../config/db');

// Tạo đơn hàng
exports.createDonHang = async (req, res) => {
  const { TenKhachHang, TrangThaiSanPham, chiTiet } = req.body;

  if (!TenKhachHang || !Array.isArray(chiTiet) || chiTiet.length === 0) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Kiểm tra khách hàng
    const [users] = await connection.execute(`SELECT IDKhachHang FROM KhachHang WHERE TenKhachHang = ?`, [TenKhachHang]);
    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }

    // Tính tổng tiền
    let tongTien = chiTiet.reduce((sum, ct) => sum + (ct.Quantity * ct.Gia), 0);

    // Tạo đơn hàng
    const [result] = await connection.execute(
      `INSERT INTO DonHang (IDKhachHang, TongTien, TrangThaiSanPham) VALUES (?, ?, ?)`,
      [users[0].IDKhachHang, tongTien, TrangThaiSanPham || 'Đang xử lý']
    );

    const IDDonHang = result.insertId;

    // Thêm chi tiết đơn hàng
    for (let ct of chiTiet) {
      if (!ct.IDSanPham || !ct.Quantity || !ct.Gia) {
        throw new Error('Chi tiết đơn hàng không hợp lệ');
      }

      // Kiểm tra tồn kho
      const [products] = await connection.execute(
        `SELECT SoTonKho FROM SanPham WHERE IDSanPham = ?`,
        [ct.IDSanPham]
      );
      if (products.length === 0 || products[0].SoTonKho < ct.Quantity) {
        throw new Error(`Sản phẩm ${ct.IDSanPham} không đủ tồn kho`);
      }

      await connection.execute(
        `INSERT INTO CTDonHang (IDDonHang, IDSanPham, Quantity, Gia) VALUES (?, ?, ?, ?)`,
        [IDDonHang, ct.IDSanPham, ct.Quantity, ct.Gia]
      );

      // Cập nhật tồn kho
      await connection.execute(
        `UPDATE SanPham SET SoTonKho = SoTonKho - ? WHERE IDSanPham = ?`,
        [ct.Quantity, ct.IDSanPham]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Tạo đơn hàng thành công', IDDonHang });
  } catch (err) {
    await connection.rollback();
    console.error('Lỗi khi tạo đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: err.message });
  } finally {
    connection.release();
  }
};

// Lấy danh sách đơn hàng
exports.getAllDonHang = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        dh.IDDonHang AS id,
        kh.TenKhachHang AS customer,
        dh.TongTien AS total,
        dh.TrangThaiSanPham AS status,
        ct.IDSanPham,
        sp.TenSanPham AS productName,
        ct.Quantity,
        ct.Gia,
        sp.HinhAnh AS image
      FROM DonHang dh
      JOIN KhachHang kh ON dh.IDKhachHang = kh.IDKhachHang
      LEFT JOIN CTDonHang ct ON dh.IDDonHang = ct.IDDonHang
      LEFT JOIN SanPham sp ON ct.IDSanPham = sp.IDSanPham
    `);

    const orders = [];
    const orderMap = new Map();

    for (const row of rows) {
      if (!orderMap.has(row.id)) {
        orderMap.set(row.id, {
          id: row.id,
          customer: row.customer,
          total: row.total,
          status: row.status,
          items: []
        });
      }

      if (row.IDSanPham) {
        orderMap.get(row.id).items.push({
          product: {
            id: row.IDSanPham,
            name: row.productName,
            price: row.Gia,
            image: row.image || 'default.jpg'
          },
          quantity: row.Quantity
        });
      }
    }

    orders.push(...orderMap.values());
    res.json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error: err.message });
  }
};

// Lấy chi tiết đơn hàng
exports.getDonHangById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[order]] = await db.execute(`
      SELECT 
        dh.IDDonHang AS id,
        kh.TenKhachHang AS customer,
        dh.TongTien AS total,
        dh.TrangThaiSanPham AS status
      FROM DonHang dh
      JOIN KhachHang kh ON dh.IDKhachHang = kh.IDKhachHang
      WHERE dh.IDDonHang = ?
    `, [id]);

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const [details] = await db.execute(`
      SELECT 
        ct.IDSanPham,
        sp.TenSanPham AS productName,
        ct.Quantity,
        ct.Gia,
        sp.HinhAnh AS image
      FROM CTDonHang ct
      JOIN SanPham sp ON ct.IDSanPham = sp.IDSanPham
      WHERE ct.IDDonHang = ?
    `, [id]);

    order.items = details.map(item => ({
      product: {
        id: item.IDSanPham,
        name: item.productName,
        price: item.Gia,
        image: item.image || 'default.jpg'
      },
      quantity: item.Quantity
    }));

    res.json(order);
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error: err.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateTrangThai = async (req, res) => {
  const { id } = req.params;
  const { TrangThaiSanPham } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE DonHang SET TrangThaiSanPham = ? WHERE IDDonHang = ?`,
      [TrangThaiSanPham, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error: err.message });
  }
};

// Xóa đơn hàng
exports.deleteDonHang = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[order]] = await connection.execute(`SELECT * FROM DonHang WHERE IDDonHang = ?`, [id]);
    if (!order) {
      await connection.rollback();
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    await connection.execute(`DELETE FROM CTDonHang WHERE IDDonHang = ?`, [id]);
    await connection.execute(`DELETE FROM DonHang WHERE IDDonHang = ?`, [id]);

    await connection.commit();
    res.json({ message: 'Xóa đơn hàng thành công' });
  } catch (err) {
    await connection.rollback();
    console.error('Lỗi khi xóa đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error: err.message });
  } finally {
    connection.release();
  }
};