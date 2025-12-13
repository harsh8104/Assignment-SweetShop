import React, { useState } from "react";
import { purchaseSweet } from "../services/sweetService";
import "./SweetCard.css";

/**
 * Sweet Card Component
 * Displays individual sweet with purchase option
 */
const SweetCard = ({ sweet, onPurchase, showActions = true }) => {
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState("");

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > sweet.quantity) {
      setMessage("Invalid quantity");
      return;
    }

    setPurchasing(true);
    setMessage("");

    try {
      await purchaseSweet(sweet._id, quantity);
      setMessage("Purchase successful! 🎉");
      setQuantity(1);
      if (onPurchase) {
        onPurchase();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Purchase failed");
    } finally {
      setPurchasing(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="sweet-card">
      <div className="sweet-image">
        <img src={sweet.imageUrl} alt={sweet.name} />
        {sweet.quantity === 0 && (
          <div className="out-of-stock">Out of Stock</div>
        )}
      </div>

      <div className="sweet-content">
        <h3 className="sweet-name">{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>

        {sweet.description && (
          <p className="sweet-description">{sweet.description}</p>
        )}

        <div className="sweet-details">
          <span className="sweet-price">${sweet.price.toFixed(2)}</span>
          <span
            className={`sweet-stock ${
              sweet.quantity === 0 ? "out" : sweet.quantity < 10 ? "low" : ""
            }`}
          >
            Stock: {sweet.quantity}
          </span>
        </div>

        {showActions && (
          <div className="sweet-actions">
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={sweet.quantity === 0}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max={sweet.quantity}
                disabled={sweet.quantity === 0}
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(sweet.quantity, quantity + 1))
                }
                disabled={sweet.quantity === 0}
              >
                +
              </button>
            </div>

            <button
              className="btn-purchase"
              onClick={handlePurchase}
              disabled={sweet.quantity === 0 || purchasing}
            >
              {purchasing ? "Processing..." : "Purchase"}
            </button>
          </div>
        )}

        {message && (
          <div
            className={`message ${
              message.includes("successful") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetCard;
