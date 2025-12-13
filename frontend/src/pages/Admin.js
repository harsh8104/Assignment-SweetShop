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
        setMessage("Sweet updated successfully! ✅");
      } else {
        await createSweet(formData);
        setMessage("Sweet created successfully! ✅");
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
        setMessage("Sweet deleted successfully! ✅");
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
        setMessage("Restocked successfully! ✅");
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
        <h1>🔧 Admin Panel</h1>
        <button onClick={openAddModal} className="btn-add">
          + Add New Sweet
        </button>
      </div>

      {message && (
        <div
          className={`message ${message.includes("✅") ? "success" : "error"}`}
        >
          {message}
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
                      ✏️
                    </button>
                    <button
                      onClick={() => handleRestock(sweet._id)}
                      className="btn-action btn-restock"
                      title="Restock"
                    >
                      📦
                    </button>
                    <button
                      onClick={() => handleDelete(sweet._id)}
                      className="btn-action btn-delete"
                      title="Delete"
                    >
                      🗑️
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
