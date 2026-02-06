// src/api/apiWithMockFallback.js
// This wrapper automatically uses mock data when backend returns 404
// Place this file in your src/api/ folder

import mockAPI from './mockData';

// Flag to enable/disable mock data (set to false when backend is ready)
const USE_MOCK_DATA = true;

/**
 * Wraps your existing API client to automatically fallback to mock data on 404
 * @param {Function} apiCall - Your original API call function
 * @param {Function} mockFunction - The corresponding mock data function
 * @param {string} endpointName - Name for logging
 */
export const apiWithMockFallback = async (apiCall, mockFunction, endpointName) => {
  // If mock data is explicitly enabled, use it directly
  if (USE_MOCK_DATA) {
    console.log(`🟡 Using mock data for: ${endpointName}`);
    return await mockFunction();
  }

  // Try real API first
  try {
    const result = await apiCall();
    console.log(`✅ Real API success: ${endpointName}`);
    return result;
  } catch (error) {
    // If 404 or connection error, fallback to mock data
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED' || !error.response) {
      console.log(`⚠️  API not available for ${endpointName}, using mock data`);
      return await mockFunction();
    }
    // For other errors, throw them (like 401, 500, etc.)
    throw error;
  }
};

/**
 * Example usage in your API service files:
 * 
 * import { apiWithMockFallback } from './apiWithMockFallback';
 * import mockAPI from './mockData';
 * import api from './client'; // your axios instance
 * 
 * export const fetchDashboardStats = () => {
 *   return apiWithMockFallback(
 *     () => api.get('/dashboard/stats'),
 *     mockAPI.getDashboardStats,
 *     'dashboard/stats'
 *   );
 * };
 */

// Pre-configured API functions ready to use
export const apiService = {
  dashboard: {
    getStats: () => apiWithMockFallback(
      () => { throw { response: { status: 404 } }; }, // Replace with your real API call
      mockAPI.getDashboardStats,
      'dashboard/stats'
    ),
    getRecentActivity: () => apiWithMockFallback(
      () => { throw { response: { status: 404 } }; },
      mockAPI.getRecentActivity,
      'dashboard/recent-activity'
    )
  },
  
  ai: {
    getInsights: () => apiWithMockFallback(
      () => { throw { response: { status: 404 } }; },
      mockAPI.getAIInsights,
      'ai/insights'
    ),
    getPredictiveAlerts: () => apiWithMockFallback(
      () => { throw { response: { status: 404 } }; },
      mockAPI.getPredictiveAlerts,
      'ai/predictive-alerts'
    ),
    getPerformanceMetrics: () => apiWithMockFallback(
      () => { throw { response: { status: 404 } }; },
      mockAPI.getPerformanceMetrics,
      'ai/performance-metrics'
    ),
    getRecommendations: () => apiWithMockFallback(
      () => { throw { response: { status: 404 } }; },
      mockAPI.getRecommendations,
      'ai/recommendations'
    ),
    getTrendingIssues: () => apiWithMockFallback(
      () => { throw { response: { status: 404 } }; },
      mockAPI.getTrendingIssues,
      'ai/trending-issues'
    )
  }
};

export default apiService;