const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ثبت‌نام
router.post('/register', authController.register);

// ورود
router.post('/login', authController.login);

module.exports = router;
