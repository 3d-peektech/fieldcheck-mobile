import apiClient from './client';

export const inspectionsAPI = {
  // Existing methods...
  getInspections: async (params = {}) => {
    return await apiClient.get('/inspections', { params });
  },

  getInspection: async (id) => {
    return await apiClient.get(`/inspections/${id}`);
  },

  createInspection: async (data) => {
    return await apiClient.post('/inspections', data);
  },

  updateInspection: async (id, data) => {
    return await apiClient.put(`/inspections/${id}`, data);
  },

  deleteInspection: async (id) => {
    return await apiClient.delete(`/inspections/${id}`);
  },

  uploadFiles: async (id, files) => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `inspection-file-${index}.jpg`
      });
    });

    return await apiClient.post(`/inspections/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getStats: async (params = {}) => {
    return await apiClient.get('/inspections/stats', { params });
  },

  // NEW AI METHODS
  analyzeImage: async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'inspection-image.jpg'
    });

    return await apiClient.post('/ai/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  generateAIReport: async (inspectionId) => {
    return await apiClient.post('/ai/generate-report', { inspectionId });
  },

  compareInspections: async (currentId, previousId) => {
    return await apiClient.post('/ai/compare', { currentId, previousId });
  },

  rewriteReport: async (inspectionId, audience) => {
    return await apiClient.post('/ai/rewrite', { inspectionId, audience });
  },
};

export default inspectionsAPI;