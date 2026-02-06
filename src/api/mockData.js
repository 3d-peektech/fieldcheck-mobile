// src/api/mockData.js
// Mock Data Service for FieldCheck Mobile App
// This provides realistic data while backend is being developed

export const mockData = {
  // Dashboard Stats
  dashboardStats: {
    aiEfficiency: {
      value: 87.5,
      change: 12,
      trend: 'up'
    },
    costSaved: {
      value: 45200,
      change: 23,
      trend: 'up'
    },
    criticalAlerts: {
      value: 5,
      change: -5,
      trend: 'down'
    },
    availability: {
      value: 98.5,
      change: 3,
      trend: 'up'
    }
  },

  // AI Insights
  aiInsights: [
    {
      id: '1',
      type: 'predictive_maintenance',
      title: 'Predictive Maintenance Alert',
      description: 'System #A-142 shows early signs of bearing wear. Recommend inspection within 5 days.',
      confidence: 78,
      priority: 'high',
      asset: 'System #A-142',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'efficiency',
      title: 'Efficiency Optimization',
      description: 'Route optimization could reduce inspection time by 15% for Zone B.',
      confidence: 85,
      priority: 'medium',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      type: 'cost_saving',
      title: 'Cost Reduction Opportunity',
      description: 'Switching to condition-based maintenance for pumps P-456 could save $8.5K annually.',
      confidence: 92,
      priority: 'high',
      timestamp: new Date().toISOString()
    }
  ],

  // Predictive Alerts
  predictiveAlerts: [
    {
      id: 'alert-1',
      type: 'critical',
      title: '2 critical maintenance overdue',
      description: 'Critical maintenance tasks require immediate attention',
      assets: ['D-456', 'E-789'],
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'critical'
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: '3 assets need inspection this week',
      description: 'Scheduled inspections due within 7 days',
      assets: ['A-145', 'B-092', 'C-234'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high'
    },
    {
      id: 'alert-3',
      type: 'info',
      title: '5 predictive maintenance recommended',
      description: 'AI recommends preventive maintenance based on usage patterns',
      assets: ['F-123', 'G-456', 'H-789', 'I-012', 'J-345'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium'
    }
  ],

  // Recent Activity
  recentActivity: [
    {
      id: 'activity-1',
      type: 'inspection_completed',
      title: 'AI-Assisted Inspection completed',
      description: 'Pump #A-142',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      confidence: 94,
      user: 'Aimar Garcia'
    },
    {
      id: 'activity-2',
      type: 'maintenance_scheduled',
      title: 'Maintenance scheduled',
      description: 'Motor #B-087 - Bearing replacement',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: 'System'
    },
    {
      id: 'activity-3',
      type: 'alert_resolved',
      title: 'Critical alert resolved',
      description: 'Compressor #C-234 - Overheating fixed',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      user: 'John Smith'
    },
    {
      id: 'activity-4',
      type: 'asset_added',
      title: 'New asset registered',
      description: 'Pump #D-789',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: 'Aimar Garcia'
    }
  ],

  // Performance Metrics
  performanceMetrics: {
    totalInspections: 2847,
    completionRate: 96.5,
    averageTime: 18.5,
    aiAccuracy: 94.2,
    trend: {
      inspections: [
        { date: '2024-01-28', count: 145 },
        { date: '2024-01-29', count: 158 },
        { date: '2024-01-30', count: 162 },
        { date: '2024-01-31', count: 149 },
        { date: '2024-02-01', count: 171 },
        { date: '2024-02-02', count: 168 },
        { date: '2024-02-03', count: 155 }
      ]
    }
  },

  // AI Recommendations
  recommendations: [
    {
      id: 'rec-1',
      title: 'Optimize Inspection Routes',
      description: 'AI suggests new route planning to reduce travel time by 25%',
      impact: 'high',
      effort: 'low',
      savings: 12500,
      category: 'efficiency'
    },
    {
      id: 'rec-2',
      title: 'Implement Condition-Based Maintenance',
      description: 'Switch from time-based to condition-based for 12 critical assets',
      impact: 'high',
      effort: 'medium',
      savings: 34000,
      category: 'maintenance'
    },
    {
      id: 'rec-3',
      title: 'Deploy IoT Sensors on High-Risk Assets',
      description: 'Real-time monitoring for 8 assets with highest failure probability',
      impact: 'medium',
      effort: 'high',
      savings: 28000,
      category: 'monitoring'
    },
    {
      id: 'rec-4',
      title: 'Consolidate Spare Parts Inventory',
      description: 'AI-optimized inventory management to reduce carrying costs',
      impact: 'medium',
      effort: 'low',
      savings: 15000,
      category: 'inventory'
    }
  ],

  // Trending Issues
  trendingIssues: [
    {
      id: 'issue-1',
      name: 'Bearing Wear',
      occurrences: 7,
      trend: 'up',
      severity: 'medium',
      affectedAssets: ['A-142', 'B-087', 'C-234', 'D-456', 'E-789', 'F-123', 'G-456']
    },
    {
      id: 'issue-2',
      name: 'Corrosion',
      occurrences: 5,
      trend: 'stable',
      severity: 'high',
      affectedAssets: ['H-789', 'I-012', 'J-345', 'K-678', 'L-901']
    },
    {
      id: 'issue-3',
      name: 'Overheating',
      occurrences: 3,
      trend: 'down',
      severity: 'high',
      affectedAssets: ['M-234', 'N-567', 'O-890']
    },
    {
      id: 'issue-4',
      name: 'Vibration',
      occurrences: 4,
      trend: 'up',
      severity: 'medium',
      affectedAssets: ['P-123', 'Q-456', 'R-789', 'S-012']
    }
  ]
};

// Helper function to simulate API delay
const simulateDelay = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock API functions that match your endpoint structure
export const mockAPI = {
  getDashboardStats: () => simulateDelay(mockData.dashboardStats),
  getAIInsights: () => simulateDelay(mockData.aiInsights),
  getPredictiveAlerts: () => simulateDelay(mockData.predictiveAlerts),
  getRecentActivity: () => simulateDelay(mockData.recentActivity),
  getPerformanceMetrics: () => simulateDelay(mockData.performanceMetrics),
  getRecommendations: () => simulateDelay(mockData.recommendations),
  getTrendingIssues: () => simulateDelay(mockData.trendingIssues)
};

export default mockAPI;