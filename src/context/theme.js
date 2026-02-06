// constants/theme.ts
export const COLORS = {
  primary: '#0F9D58',
  primaryDark: '#0B7F46',
  primaryLight: '#34C759',
  
  background: '#f5f5f5',
  white: '#fff',
  black: '#000',
  
  text: {
    primary: '#333',
    secondary: '#666',
    tertiary: '#999',
    inverse: '#fff',
  },
  
  status: {
    online: '#0F9D58',
    warning: '#F4B400',
    error: '#DB4437',
    info: '#4285F4',
  },
  
  gradients: {
    financial: ['#0F9D58', '#0B7F46'] as const,
    health: ['#DB4437', '#C1351D'] as const,
    voice: ['#4285F4', '#3367D6'] as const,
    analytics: ['#F4B400', '#DB9200'] as const,
    reports: ['#9C27B0', '#7B1FA2'] as const,
    team: ['#00BCD4', '#0097A7'] as const,
    notifications: ['#FF5722', '#E64A19'] as const,
    settings: ['#607D8B', '#455A64'] as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 30,
  circle: 9999,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 28,
} as const;

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: 'bold',
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;