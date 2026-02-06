import apiClient from './client';

export const assetsAPI = {
  // Get all assets
  getAssets: async (params = {}) => {
    return await apiClient.get('/assets', { params });
  },

  // Get single asset
  getAsset: async (id) => {
    return await apiClient.get(`/assets/${id}`);
  },

  // Scan asset by QR code or tag
  scanAsset: async (code) => {
    return await apiClient.get(`/assets/scan/${code}`);
  },

  // Create asset
  createAsset: async (data) => {
    return await apiClient.post('/assets', data);
  },

  // Update asset
  updateAsset: async (id, data) => {
    return await apiClient.put(`/assets/${id}`, data);
  },

  // Delete asset
  deleteAsset: async (id) => {
    return await apiClient.delete(`/assets/${id}`);
  },

  // Upload asset image
  uploadImage: async (id, imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'asset-image.jpg'
    });

    return await apiClient.post(`/assets/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get asset statistics
  getStats: async () => {
    return await apiClient.get('/assets/stats');
  },

  // Add maintenance record
  addMaintenance: async (id, data) => {
    return await apiClient.post(`/assets/${id}/maintenance`, data);
  },

  // Generate QR code
  generateQRCode: async (id) => {
    return await apiClient.get(`/assets/${id}/qrcode`);
  }
};

export default assetsAPI;