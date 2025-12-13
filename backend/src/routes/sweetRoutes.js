const express = require("express");
const router = express.Router();
const {
  createSweet,
  getAllSweets,
  getSweetById,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require("../controllers/sweetController");
const { protect, admin } = require("../middleware/auth");

// Public search route (before :id route to avoid conflicts)
router.get("/search", protect, searchSweets);

// Sweet CRUD routes
router.route("/").get(protect, getAllSweets).post(protect, admin, createSweet);

router
  .route("/:id")
  .get(protect, getSweetById)
  .put(protect, admin, updateSweet)
  .delete(protect, admin, deleteSweet);

// Inventory management routes
router.post("/:id/purchase", protect, purchaseSweet);
router.post("/:id/restock", protect, admin, restockSweet);

module.exports = router;
