import api from "./api";

/**
 * Sweet Service
 * Handles sweet/product operations
 */

/**
 * Get all sweets
 * @returns {Promise} Array of sweets
 */
export const getAllSweets = async () => {
  const response = await api.get("/sweets");
  return response.data;
};

/**
 * Get sweet by ID
 * @param {string} id - Sweet ID
 * @returns {Promise} Sweet data
 */
export const getSweetById = async (id) => {
  const response = await api.get(`/sweets/${id}`);
  return response.data;
};

/**
 * Search sweets
 * @param {Object} params - Search parameters
 * @returns {Promise} Array of matching sweets
 */
export const searchSweets = async (params) => {
  const response = await api.get("/sweets/search", { params });
  return response.data;
};

/**
 * Create a new sweet
 * @param {Object} sweetData - Sweet data
 * @returns {Promise} Created sweet
 */
export const createSweet = async (sweetData) => {
  const response = await api.post("/sweets", sweetData);
  return response.data;
};

/**
 * Update a sweet
 * @param {string} id - Sweet ID
 * @param {Object} sweetData - Updated sweet data
 * @returns {Promise} Updated sweet
 */
export const updateSweet = async (id, sweetData) => {
  const response = await api.put(`/sweets/${id}`, sweetData);
  return response.data;
};

/**
 * Delete a sweet
 * @param {string} id - Sweet ID
 * @returns {Promise} Success message
 */
export const deleteSweet = async (id) => {
  const response = await api.delete(`/sweets/${id}`);
  return response.data;
};

/**
 * Purchase a sweet
 * @param {string} id - Sweet ID
 * @param {number} quantity - Quantity to purchase
 * @returns {Promise} Purchase result
 */
export const purchaseSweet = async (id, quantity) => {
  const response = await api.post(`/sweets/${id}/purchase`, { quantity });
  return response.data;
};

/**
 * Restock a sweet
 * @param {string} id - Sweet ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise} Restock result
 */
export const restockSweet = async (id, quantity) => {
  const response = await api.post(`/sweets/${id}/restock`, { quantity });
  return response.data;
};
