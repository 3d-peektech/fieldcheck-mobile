// utils/helpers.ts
import { SystemStatusType } from '../types/menu.types';
import { COLORS } from '../constants/theme';

/**
 * Get color for system status
 */
export const getStatusColor = (status: SystemStatusType): string => {
  switch (status) {
    case 'online':
    case 'synced':
      return COLORS.status.online;
    case 'warning':
      return COLORS.status.warning;
    case 'offline':
      return COLORS.status.error;
    default:
      return COLORS.status.warning;
  }
};

/**
 * Format time ago string
 */
export const getTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/**
 * Haptic feedback wrapper
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light'): void => {
  // Implement haptic feedback based on platform
  // For iOS: use Haptics from expo-haptics
  // For Android: use Vibration from react-native
  console.log(`Haptic feedback: ${type}`);
};

/**
 * Analytics event tracking
 */
export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  // Implement your analytics tracking here
  console.log('Track event:', eventName, params);
};