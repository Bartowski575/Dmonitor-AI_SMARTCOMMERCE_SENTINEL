const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const productController = require('../controllers/productController.js');

router.get('/dashboard', auth, productController.getDashboardStats);
router.get('/', auth, productController.getProducts);
router.post('/create', auth, productController.createProduct);
router.get('/:sku', auth, productController.getProductBySku);
router.put('/:sku', auth, productController.updateProduct);
router.delete('/:sku', auth, productController.deleteProduct);

module.exports = router;