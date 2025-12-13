import React, { useState, useEffect } from "react";
import SweetCard from "../components/SweetCard";
import { getAllSweets, searchSweets } from "../services/sweetService";
import "./Home.css";

/**
 * Home Page Component
 * Displays all sweets with search and filter functionality
 */
const Home = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter state
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
    setLoading(true);
    setError("");

    try {
      const data = await getAllSweets();
      setSweets(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await searchSweets(params);
      setSweets(data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchName("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    loadSweets();
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#e0e7ff"
            />
            <circle cx="12" cy="9" r="2.5" fill="#6366f1" />
            <path
              d="M15.5 8.5c.5.5 1 1.5.5 2.5M8.5 8.5c-.5.5-1 1.5-.5 2.5"
              stroke="#6366f1"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1>Welcome to Sweet Shop</h1>
        <p>Discover and purchase your favorite sweets</p>
      </div>

      <div className="search-section">
        <h2>Search & Filter</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-row">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="search-row">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
              className="price-input"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
              className="price-input"
            />
          </div>

          <div className="search-buttons">
            <button type="submit" className="btn-search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "8px" }}
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M16 16l5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Search
            </button>
            <button type="button" onClick={handleReset} className="btn-reset">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "8px" }}
              >
                <path
                  d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M3 3v5h5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Reset
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading sweets...</p>
        </div>
      ) : sweets.length === 0 ? (
        <div className="no-sweets">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: "16px", opacity: 0.5 }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#9ca3af"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 8v4M12 16h.01"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h3>No sweets found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="sweets-grid">
          {sweets.map((sweet) => (
            <SweetCard key={sweet._id} sweet={sweet} onPurchase={loadSweets} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
