const mongoose = require("mongoose");

/**
 * Sweet Schema
 * Represents a sweet product in the inventory
 */
const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sweet name is required"],
      trim: true,
      minlength: [2, "Sweet name must be at least 2 characters long"],
      maxlength: [100, "Sweet name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Chocolate",
          "Candy",
          "Gummy",
          "Hard Candy",
          "Lollipop",
          "Toffee",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for search functionality
 */
sweetSchema.index({ name: "text", category: "text" });

const Sweet = mongoose.model("Sweet", sweetSchema);

module.exports = Sweet;
