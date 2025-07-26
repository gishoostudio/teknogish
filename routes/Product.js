import express from 'express';
import {
  addProduct,
  getAllProducts,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.post('/add', addProduct);
router.get('/', getAllProducts);
router.delete('/:id', deleteProduct);

export default router;
