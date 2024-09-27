const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  otpVerification,
  addVehicleToWishlist,
  removeVehicleFromWishlist,
  addSparePartToWishlist,
  removeSparePartFromWishlist,
  updateProfile,
  getWishlist,
} = require('../controllers/userController');
const { verifyToken, isBuyer } = require('../middlewares/authMiddleware'); 
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-otp', otpVerification);
router.put('/update-profile', verifyToken, updateProfile);
router.get('/wishlist/:userId', verifyToken, getWishlist);
router.post('/wishlist/vehicle/add', verifyToken, isBuyer, addVehicleToWishlist);
router.post('/wishlist/vehicle/remove', verifyToken, isBuyer, removeVehicleFromWishlist);
router.post('/wishlist/spare-part/add', verifyToken, isBuyer, addSparePartToWishlist);
router.post('/wishlist/spare-part/remove', verifyToken, isBuyer, removeSparePartFromWishlist);

module.exports = router;