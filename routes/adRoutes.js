const express = require("express");
const {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
  getAdsForUser,
  getFeaturedAds
} = require("../controllers/adController");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  upload,
  uploadImageToFirebase,
} = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post(
  "/create",
  verifyToken,
  upload.array("images", 5),
  uploadImageToFirebase,
  createAd
);
router.get("/", getAllAds);
router.get("/featured", getFeaturedAds);
router.get("/:adId", getAdById);
router.put(
  "/:adId",
  verifyToken,
  upload.array("images", 5),
  uploadImageToFirebase,
  updateAd
);
router.delete("/:adId", verifyToken, deleteAd);
router.get("/user/:userId", verifyToken, getAdsForUser);


module.exports = router;
