const express = require('express');
const router = express.Router();
const sanphamController = require('../controllers/sanphamController');

// Các tuyến API cho sản phẩm
router.get('/', sanphamController.getAllSanPham);
router.get('/:id', sanphamController.getSanPhamById);
router.post('/', sanphamController.createSanPham);
router.put('/:id', sanphamController.updateSanPham);
router.delete('/:id', sanphamController.deleteSanPham);

module.exports = router;
