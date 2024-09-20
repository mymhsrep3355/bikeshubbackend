const Store = require('../models/storeModel');
const Vehicle = require('../models/vehicleModel');
const SparePart = require('../models/sparePartModel');


exports.createStore = async (req, res) => {
  const { name, description } = req.body;
  const sellerId = req.user.id; 

  try {
    const store = new Store({
      name,
      description,
      seller: sellerId,
    });

    await store.save();
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateStore = async (req, res) => {
    const { storeId } = req.params;
    const { name, description } = req.body;
  
    try {
      const store = await Store.findByIdAndUpdate(storeId, { name, description }, { new: true });
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }
      res.status(200).json({ message: 'Store updated successfully', store });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
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

  exports.getAllStoresWithProducts = async (req, res) => {
    try {
      const stores = await Store.find().populate('seller', 'username email');

      const storeDetails = await Promise.all(
        stores.map(async (store) => {
          const vehicles = await Vehicle.find({ store: store._id });
          const spareParts = await SparePart.find({ store: store._id });
  
          return {
            store: {
              id: store._id,
              name: store.name,
              description: store.description,
              seller: store.seller,
            },
            vehicles,
            spareParts,
          };
        })
      );
  
      res.status(200).json(storeDetails);
    } catch (error) {
      console.error('Error fetching stores with products:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate('seller', 'username email');
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
