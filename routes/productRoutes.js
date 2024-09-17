const express = require('express');
const { addVehicle, addSparePart, updateVehicle, deleteVehicle, updateSparePart, deleteSparePart, getAllVehiclesInStore, getAllSparePartsInStore, getVehicleById, getSparePartById} = require('../controllers/productController');
const { verifyToken, isSeller } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/add-vehicle', verifyToken, isSeller, upload.array('images', 5), addVehicle);
router.post('/add-spare-part', verifyToken, isSeller, upload.array('images', 5), addSparePart);
router.put('/vehicle/:vehicleId', verifyToken, isSeller, updateVehicle);
router.delete('/vehicle/:vehicleId', verifyToken, isSeller, deleteVehicle);
router.put('/spare-part/:sparePartId', verifyToken, isSeller, updateSparePart);
router.delete('/spare-part/:sparePartId', verifyToken, isSeller, deleteSparePart);
router.get('/store/:storeId/vehicles', getAllVehiclesInStore);
router.get('/store/:storeId/spare-parts', getAllSparePartsInStore);
router.get('/vehicle/:vehicleId', verifyToken, getVehicleById);
router.get('/spare-part/:sparePartId', verifyToken, getSparePartById);

module.exports = router;
