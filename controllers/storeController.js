const Store = require("../models/storeModel");
const Vehicle = require("../models/vehicleModel");
const SparePart = require("../models/sparePartModel");

exports.createStore = async (req, res) => {
  const { name, description } = req.body;
  const sellerId = req.user.id;

  const images = req.files ? req.files.map(file => file.firebaseUrl) : [];
  if (images.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  try {
    const store = new Store({
      name,
      description,
      images,
      seller: sellerId,
    });

    await store.save();
    res.status(201).json({ message: "Store created successfully", store });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateStore = async (req, res) => {
  const { storeId } = req.params;
  const { name, description } = req.body;

  const images = req.files ? req.files.map(file => file.firebaseUrl) : [];

  if (images.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  try {
    const updateFields = { name, description };


    if (images) {
      updateFields.images = images;
    }

    const store = await Store.findByIdAndUpdate(storeId, updateFields, {
      new: true,
    });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.status(200).json({ message: "Store updated successfully", store });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findByIdAndDelete(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.getStoresForUser = async (req, res) => {
  const { userId } = req.params; 

  try {
    
    const stores = await Store.find({ seller: userId }).populate('seller', 'username email');

    if (stores.length === 0) {
      return res.status(404).json({ message: 'No stores found for this user' });
    }

    res.status(200).json({ message: 'Stores retrieved successfully', stores });
  } catch (error) {
    console.error('Error fetching stores for user:', error);
    res.status(500).json({ message: 'Failed to retrieve stores for user', error });
  }
};

exports.getStoreWithProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await Store.findById(storeId).populate(
      "seller",
      "username email"
    );

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const vehicles = await Vehicle.find({ store: storeId });
    const spareParts = await SparePart.find({ store: storeId });

    res.status(200).json({
      store,
      vehicles,
      spareParts,
    });
  } catch (error) {
    console.error("Error retrieving store and products:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve store and products", error });
  }
};

exports.getAllStoresWithProducts = async (req, res) => {
  try {
    const stores = await Store.find().populate("seller", "username email");

    const storeDetails = await Promise.all(
      stores.map(async (store) => {
        const vehicles = await Vehicle.find({ store: store._id });
        const spareParts = await SparePart.find({ store: store._id });

        return {
          store: {
            id: store._id,
            name: store.name,
            description: store.description,
            image: store.image, // Include the store image in the response
            seller: store.seller,
          },
          vehicles,
          spareParts,
        };
      })
    );

    res.status(200).json(storeDetails);
  } catch (error) {
    console.error("Error fetching stores with products:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("seller", "username email");
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
