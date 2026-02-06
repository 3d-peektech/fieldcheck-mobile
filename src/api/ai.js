import apiClient from './client';
import mockAPI from './mockData';

// Flag to enable/disable mock data
const USE_MOCK_DATA = true;

// Helper function to try API call with mock fallback
const apiWithMockFallback = async (apiCall, mockFunction, endpointName) => {
  if (USE_MOCK_DATA) {
    console.log('🟡 Using mock data for:', endpointName);
    return await mockFunction();
  }

  try {
    const response = await apiCall();
    console.log('✅ Real API success:', endpointName);
    return response;
  } catch (error) {
    if (error.response?.status === 404 || !error.response) {
      console.log('⚠️ API not available for', endpointName, '- using mock data');
      return await mockFunction();
    }
    throw error;
  }
};

export const aiAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return apiWithMockFallback(
      () => apiClient.get('/dashboard/stats'),
      mockAPI.getDashboardStats,
      'dashboard/stats'
    );
  },

  // Get AI-powered insights
  getInsights: async () => {
    return apiWithMockFallback(
      () => apiClient.get('/ai/insights'),
      mockAPI.getAIInsights,
      'ai/insights'
    );
  },

  // Get predictive maintenance alerts
  getPredictiveAlerts: async () => {
    return apiWithMockFallback(
      () => apiClient.get('/ai/predictive-alerts'),
      mockAPI.getPredictiveAlerts,
      'ai/predictive-alerts'
    );
  },

  // Get recent activity
  getRecentActivity: async () => {
    return apiWithMockFallback(
      () => apiClient.get('/dashboard/recent-activity'),
      mockAPI.getRecentActivity,
      'dashboard/recent-activity'
    );
  },

  // Get performance metrics (MTBF, MTTR, etc.)
  getPerformanceMetrics: async () => {
    return apiWithMockFallback(
      () => apiClient.get('/ai/performance-metrics'),
      mockAPI.getPerformanceMetrics,
      'ai/performance-metrics'
    );
  },

  // Get AI recommendations
  getRecommendations: async () => {
    return apiWithMockFallback(
      () => apiClient.get('/ai/recommendations'),
      mockAPI.getRecommendations,
      'ai/recommendations'
    );
  },

  // Get trending issues
  getTrendingIssues: async () => {
    return apiWithMockFallback(
      () => apiClient.get('/ai/trending-issues'),
      mockAPI.getTrendingIssues,
      'ai/trending-issues'
    );
  },

  // Get detailed insight by ID
  getInsightDetails: async (insightId) => {
    try {
      const response = await apiClient.get(`/ai/insights/${insightId}`);
      return response;
    } catch (error) {
      console.error('Error fetching insight details:', error);
      throw error;
    }
  },

  // Perform AI analysis on asset
  analyzeAsset: async (assetId, imageData) => {
    try {
      const response = await apiClient.post('/ai/analyze-asset', {
        assetId,
        imageData,
      });
      return response;
    } catch (error) {
      console.error('Error analyzing asset:', error);
      throw error;
    }
  },

  // Get anomaly detection results
  getAnomalies: async (params = {}) => {
    try {
      const response = await apiClient.get('/ai/anomalies', { params });
      return response;
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      throw error;
    }
  },

  // Get failure prediction for specific asset
  predictFailure: async (assetId) => {
    try {
      const response = await apiClient.post('/ai/predict-failure', { assetId });
      return response;
    } catch (error) {
      console.error('Error predicting failure:', error);
      throw error;
    }
  },

  // Get optimization suggestions
  getOptimizations: async () => {
    try {
      const response = await apiClient.get('/ai/optimizations');
      return response;
    } catch (error) {
      console.error('Error fetching optimizations:', error);
      throw error;
    }
  },

  // Acknowledge/dismiss an alert
  acknowledgeAlert: async (alertId) => {
    try {
      const response = await apiClient.post(`/ai/alerts/${alertId}/acknowledge`);
      return response;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  },

  // Get AI model confidence scores
  getModelConfidence: async () => {
    try {
      const response = await apiClient.get('/ai/model-confidence');
      return response;
    } catch (error) {
      console.error('Error fetching model confidence:', error);
      throw error;
    }
  },

  // Train AI model with new data
  trainModel: async (trainingData) => {
    try {
      const response = await apiClient.post('/ai/train', trainingData);
      return response;
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  },
};

export default aiAPI;