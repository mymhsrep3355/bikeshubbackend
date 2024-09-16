const Vehicle = require('../models/vehicleModel');
const SparePart = require('../models/sparePartModel');
const Store = require('../models/storeModel');

exports.addVehicle = async (req, res) => {
  const { name, model, year, company, description, price, storeId } = req.body;
  const images = req.files ? req.files.map(file => file.path) : []; 

  if (images.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const vehicle = new Vehicle({
      images,
      name,
      model,
      year,
      company,
      description,
      price,
      store: storeId,
    });

    await vehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.addSparePart = async (req, res) => {
  const { name, description, usage, storeId } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];

  if (images.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const sparePart = new SparePart({
      images,
      name,
      description,
      usage,
      store: storeId,
    });

    await sparePart.save();
    res.status(201).json({ message: 'Spare part added successfully', sparePart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateVehicle = async (req, res) => {
    const { vehicleId } = req.params;
    const { name, model, year, company, description, price, status } = req.body;
  
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(
        vehicleId,
        { name, model, year, company, description, price, status },
        { new: true }
      );
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Delete vehicle
  exports.deleteVehicle = async (req, res) => {
    const { vehicleId } = req.params;
  
    try {
      const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Update spare part
  exports.updateSparePart = async (req, res) => {
    const { sparePartId } = req.params;
    const { name, description, usage } = req.body;
  
    try {
      const sparePart = await SparePart.findByIdAndUpdate(
        sparePartId,
        { name, description, usage },
        { new: true }
      );
      if (!sparePart) {
        return res.status(404).json({ message: 'Spare part not found' });
      }
      res.status(200).json({ message: 'Spare part updated successfully', sparePart });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Delete spare part
  exports.deleteSparePart = async (req, res) => {
    const { sparePartId } = req.params;
  
    try {
      const sparePart = await SparePart.findByIdAndDelete(sparePartId);
      if (!sparePart) {
        return res.status(404).json({ message: 'Spare part not found' });
      }
      res.status(200).json({ message: 'Spare part deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Get all vehicles in a store
  exports.getAllVehiclesInStore = async (req, res) => {
    const { storeId } = req.params;
  
    try {
      const vehicles = await Vehicle.find({ store: storeId });
      res.status(200).json({ vehicles });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Get all spare parts in a store
  exports.getAllSparePartsInStore = async (req, res) => {
    const { storeId } = req.params;
  
    try {
      const spareParts = await SparePart.find({ store: storeId });
      res.status(200).json({ spareParts });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  
exports.getStoreProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    const vehicles = await Vehicle.find({ store: storeId });
    const spareParts = await SparePart.find({ store: storeId });

    res.status(200).json({ vehicles, spareParts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
