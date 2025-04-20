require('dotenv').config();
const mysql = require('mysql2/promise');

// Cấu hình pool kết nối MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kiểm tra kết nối
db.getConnection()
    .then((connection) => {
        console.log('Đã kết nối tới cơ sở dữ liệu MySQL');
        connection.release();
    })
    .catch((err) => {
        console.error('Lỗi khi kết nối MySQL:', err);
    });

module.exports = db;