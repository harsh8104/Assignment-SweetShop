import React, { useState, useEffect } from "react";
import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
} from "../services/sweetService";
import "./Admin.css";

/**
 * Admin Panel Component
 * Allows admins to manage sweets inventory
 */
const Admin = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Chocolate",
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
  });

  const categories = [
    "Chocolate",
    "Candy",
    "Gummy",
    "Hard Candy",
    "Lollipop",
    "Toffee",
    "Other",
  ];

  const loadSweets = async () => {
    try {
      const data = await getAllSweets();
      setSweets(data);
    } catch (err) {
      setMessage("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editingSweet) {
        await updateSweet(editingSweet._id, formData);
        setMessage("Sweet updated successfully!");
      } else {
        await createSweet(formData);
        setMessage("Sweet created successfully!");
      }

      resetForm();
      loadSweets();
      setShowModal(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || "",
      imageUrl: sweet.imageUrl || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sweet?")) {
      try {
        await deleteSweet(id);
        setMessage("Sweet deleted successfully!");
        loadSweets();
      } catch (err) {
        setMessage(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt("Enter quantity to add:");
    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
      try {
        await restockSweet(id, parseInt(quantity));
        setMessage("Restocked successfully!");
        loadSweets();
      } catch (err) {
        setMessage(err.response?.data?.message || "Restock failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Chocolate",
      price: "",
      quantity: "",
      description: "",
      imageUrl: "",
    });
    setEditingSweet(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "12px", verticalAlign: "middle" }}
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="#6366f1"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="#6366f1"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="#6366f1"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="#6366f1"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Admin Panel
        </h1>
        <button onClick={openAddModal} className="btn-add">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "6px" }}
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add New Sweet
        </button>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message.replace(/✅/g, "")}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet._id}>
                  <td>{sweet.name}</td>
                  <td>
                    <span className="category-badge">{sweet.category}</span>
                  </td>
                  <td>${sweet.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`stock-badge ${
                        sweet.quantity === 0
                          ? "out"
                          : sweet.quantity < 10
                          ? "low"
                          : "ok"
                      }`}
                    >
                      {sweet.quantity}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(sweet)}
                      className="btn-action btn-edit"
                      title="Edit"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginRight: "4px" }}
                      >
                        <path
                          d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleRestock(sweet._id)}
                      className="btn-action btn-restock"
                      title="Restock"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginRight: "4px" }}
                      >
                        <path
                          d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M12 11v6M9 14h6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16 3l-4 4-4-4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                      Restock
                    </button>
                    <button
                      onClick={() => handleDelete(sweet._id)}
                      className="btn-action btn-delete"
                      title="Delete"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginRight: "4px" }}
                      >
                        <path
                          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sweets.length === 0 && (
            <div className="no-data">
              <p>No sweets available. Add your first sweet!</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSweet ? "Edit Sweet" : "Add New Sweet"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Sweet name"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Optional description"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingSweet ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
