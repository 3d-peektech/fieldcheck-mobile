export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.131:8080/api/v1'  // Development
  : 'https://fieldcheck-production.up.railway.app/api/v1';  // Production

export const APP_NAME = 'FieldCheck';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  TOKEN: '@fieldcheck_token',
  USER: '@fieldcheck_user',
  SETTINGS: '@fieldcheck_settings'
};

export const ASSET_CATEGORIES = [
  { label: 'HVAC', value: 'hvac' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Mechanical', value: 'mechanical' },
  { label: 'Structural', value: 'structural' },
  { label: 'Safety', value: 'safety' },
  { label: 'IT', value: 'it' },
  { label: 'Vehicle', value: 'vehicle' },
  { label: 'Other', value: 'other' }
];

export const ASSET_STATUS = [
  { label: 'Active', value: 'active', color: '#4CAF50' },
  { label: 'Maintenance', value: 'maintenance', color: '#FF9800' },
  { label: 'Retired', value: 'retired', color: '#9E9E9E' },
  { label: 'Pending', value: 'pending', color: '#2196F3' },
  { label: 'Decommissioned', value: 'decommissioned', color: '#757575' }
];

export const INSPECTION_STATUS = [
  { label: 'Scheduled', value: 'scheduled', color: '#2196F3' },
  { label: 'In Progress', value: 'in-progress', color: '#FF9800' },
  { label: 'Completed', value: 'completed', color: '#4CAF50' },
  { label: 'Failed', value: 'failed', color: '#F44336' },
  { label: 'Cancelled', value: 'cancelled', color: '#9E9E9E' }
];

export const CONDITIONS = [
  { label: 'Excellent', value: 'excellent', color: '#4CAF50' },
  { label: 'Good', value: 'good', color: '#8BC34A' },
  { label: 'Fair', value: 'fair', color: '#FF9800' },
  { label: 'Poor', value: 'poor', color: '#FF5722' },
  { label: 'Critical', value: 'critical', color: '#F44336' }
];

export const PRIORITIES = [
  { label: 'Low', value: 'low', color: '#2196F3' },
  { label: 'Medium', value: 'medium', color: '#FF9800' },
  { label: 'High', value: 'high', color: '#FF5722' },
  { label: 'Urgent', value: 'urgent', color: '#F44336' }
];