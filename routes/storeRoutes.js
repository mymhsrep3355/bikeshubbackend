const express = require('express');
const { createStore, getAllStores, updateStore, deleteStore, getAllStoresWithProducts, getStoreWithProducts } = require('../controllers/storeController');
const { verifyToken, isSeller } = require('../middlewares/authMiddleware');
const { upload, uploadImageToFirebase } = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post(
  '/create',
  verifyToken,
  isSeller,
  upload.array("images", 5),
  uploadImageToFirebase,
  createStore
);

router.get('/all-with-products', verifyToken, getAllStoresWithProducts);
router.get('/', getAllStores);
router.get('/:storeId/products', verifyToken, getStoreWithProducts);

router.put(
  '/:storeId',
  verifyToken,
  isSeller,
  upload.array("images", 5),
  uploadImageToFirebase,
  updateStore
);

router.delete('/:storeId', verifyToken, isSeller, deleteStore);

module.exports = router;
