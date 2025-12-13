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

  const isOutOfStock = !sweet?.quantity || sweet.quantity <= 0;

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > sweet.quantity) {
      setMessage("Invalid quantity");
      return;
    }

    setPurchasing(true);
    setMessage("");

    try {
      await purchaseSweet(sweet._id, quantity);
      setMessage("Purchase successful!");
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
                disabled={isOutOfStock}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max={sweet.quantity}
                disabled={isOutOfStock}
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(sweet.quantity, quantity + 1))
                }
                disabled={isOutOfStock}
              >
                +
              </button>
            </div>

            <button
              className="btn-purchase"
              onClick={handlePurchase}
              disabled={isOutOfStock || purchasing}
            >
              {purchasing ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      marginRight: "6px",
                      animation: "spin 1s linear infinite",
                    }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="31.4 31.4"
                      strokeDashoffset="0"
                      fill="none"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "6px" }}
                  >
                    <circle
                      cx="9"
                      cy="19"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="18"
                      cy="19"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  Purchase
                </>
              )}
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
