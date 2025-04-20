const express = require('express');
const router = express.Router();
const { register, login, registerClient } = require('../controllers/authController');
// const { authMiddleware } = require('../middlewares/authMiddleware')

router.post('/register', register);
router.post('/registerClient', registerClient);
router.post('/login', login);

module.exports = router;