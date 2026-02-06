import apiClient from './client';

export const subscriptionsAPI = {
  // Get current subscription
  getCurrent: async () => {
    return await apiClient.get('/subscriptions/current');
  },

  // Get usage stats
  getUsage: async () => {
    return await apiClient.get('/subscriptions/usage');
  },

  // Upgrade plan
  upgrade: async (plan) => {
    return await apiClient.post('/subscriptions/upgrade', { plan });
  },
};

export default subscriptionsAPI;