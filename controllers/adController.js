const Ad = require('../models/adModel');

exports.createAd = async (req, res) => {
  const { adName, location, salePrice, contact, bikeInfo } = req.body;
//   const images = req.files ? req.files.map(file => file.path) : [];
const images = req.files ? req.files.map(file => file.firebaseUrl) : [];

  if (images.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  try {
    const ad = new Ad({
      adName,
      location,
      images,
      salePrice,
      contact,
      bikeInfo,
      postedBy: req.user.id,
    });

    await ad.save();
    res.status(201).json({ message: 'Ad posted successfully', ad });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAdsForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from request parameters

    // Check if the userId is a valid ObjectId
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find all ads posted by the specified user ID
    const ads = await Ad.find({ postedBy: userId });

    if (ads.length === 0) {
      return res.status(404).json({ message: 'No ads found for this user' });
    }

    res.status(200).json({ message: 'Ads retrieved successfully', ads });
  } catch (error) {
    console.error('Error fetching ads for user:', error);
    res.status(500).json({ message: 'Failed to retrieve ads for user', error });
  }
};

// Get all ads
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate('postedBy', 'username email');
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get ad by ID
exports.getAdById = async (req, res) => {
  const { adId } = req.params;

  try {
    const ad = await Ad.findById(adId).populate('postedBy', 'username email');
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update ad by ID
exports.updateAd = async (req, res) => {
  const { adId } = req.params;
  const { adName, location, salePrice, contact, bikeInfo, status } = req.body;

  try {
    const ad = await Ad.findByIdAndUpdate(
      adId,
      { adName, location, salePrice, contact, bikeInfo, status },
      { new: true }
    );
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.status(200).json({ message: 'Ad updated successfully', ad });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete ad by ID
exports.deleteAd = async (req, res) => {
  const { adId } = req.params;

  try {
    const ad = await Ad.findByIdAndDelete(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};