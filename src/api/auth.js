import apiClient from './client';

export const authAPI = {
  // Register new user and company
  register: async (data) => {
    return await apiClient.post('/auth/register', data);
  },

  // Login
  login: async (email, password) => {
    return await apiClient.post('/auth/login', { email, password });
  },

  // Get current user
  getMe: async () => {
    return await apiClient.get('/auth/me');
  },

  // Update profile
  updateProfile: async (data) => {
    return await apiClient.put('/auth/updateprofile', data);
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    return await apiClient.put('/auth/updatepassword', {
      currentPassword,
      newPassword
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await apiClient.post('/auth/forgotpassword', { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return await apiClient.put(`/auth/resetpassword/${token}`, { password });
  },

  // Logout
  logout: async () => {
    return await apiClient.post('/auth/logout');
  }
};

export default authAPI;