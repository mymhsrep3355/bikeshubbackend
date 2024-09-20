const express = require('express');
const { createStore, getAllStores, updateStore, deleteStore, getAllStoresWithProducts } = require('../controllers/storeController');
const { verifyToken, isSeller } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', verifyToken, isSeller, createStore);
router.get('/all-with-products', verifyToken, getAllStoresWithProducts);
router.get('/', getAllStores);
router.put('/:storeId', verifyToken, isSeller, updateStore);
router.delete('/:storeId', verifyToken, isSeller, deleteStore);

module.exports = router;
