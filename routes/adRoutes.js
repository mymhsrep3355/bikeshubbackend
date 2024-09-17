const express = require("express");
const {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
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
router.get("/:adId", getAdById);
router.put(
  "/:adId",
  verifyToken,
  upload.array("images", 5),
  uploadImageToFirebase,
  updateAd
);
router.delete("/:adId", verifyToken, deleteAd);

module.exports = router;
