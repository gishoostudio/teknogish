const express = require('express');
const router = express.Router();
const productController = require('../productController');

// مسیر افزودن محصول
router.post('/add', productController.addProduct);

// نمایش همه محصولات
router.get('/', productController.getAllProducts);

// حذف محصول با آیدی
router.delete('/:id', productController.deleteProduct);

module.exports = router;
