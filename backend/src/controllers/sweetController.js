const Sweet = require("../models/Sweet");

/**
 * Create a new sweet
 * @route POST /api/sweets
 * @access Private/Admin
 */
const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, description, imageUrl } = req.body;

    // Validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl,
    });

    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all sweets
 * @route GET /api/sweets
 * @access Private
 */
const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get sweet by ID
 * @route GET /api/sweets/:id
 * @access Private
 */
const getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
      res.json(sweet);
    } else {
      res.status(404).json({ message: "Sweet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search sweets by name, category, or price range
 * @route GET /api/sweets/search
 * @access Private
 */
const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    // Search by name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a sweet
 * @route PUT /api/sweets/:id
 * @access Private/Admin
 */
const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
      sweet.name = req.body.name || sweet.name;
      sweet.category = req.body.category || sweet.category;
      sweet.price = req.body.price !== undefined ? req.body.price : sweet.price;
      sweet.quantity =
        req.body.quantity !== undefined ? req.body.quantity : sweet.quantity;
      sweet.description = req.body.description || sweet.description;
      sweet.imageUrl = req.body.imageUrl || sweet.imageUrl;

      const updatedSweet = await sweet.save();
      res.json(updatedSweet);
    } else {
      res.status(404).json({ message: "Sweet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a sweet
 * @route DELETE /api/sweets/:id
 * @access Private/Admin
 */
const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
      await sweet.deleteOne();
      res.json({ message: "Sweet removed" });
    } else {
      res.status(404).json({ message: "Sweet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Purchase a sweet (decrease quantity)
 * @route POST /api/sweets/:id/purchase
 * @access Private
 */
const purchaseSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    sweet.quantity -= quantity;
    const updatedSweet = await sweet.save();

    res.json({
      message: "Purchase successful",
      sweet: updatedSweet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Restock a sweet (increase quantity)
 * @route POST /api/sweets/:id/restock
 * @access Private/Admin
 */
const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += quantity;
    const updatedSweet = await sweet.save();

    res.json({
      message: "Restock successful",
      sweet: updatedSweet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSweet,
  getAllSweets,
  getSweetById,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
