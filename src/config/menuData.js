// config/menuData.ts
import { MenuItem, QuickStat, SystemStatus } from '../types/menu.types';
import { COLORS } from '../constants/theme';

export const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: '1',
    title: 'Financial AI Predictor',
    subtitle: 'Real-time ROI & cost analysis',
    icon: 'cash-multiple',
    gradient: [COLORS.gradients.financial[0], COLORS.gradients.financial[1]],
    badge: 'Live',
    screen: 'FinancialAI',
  },
  {
    id: '2',
    title: 'Asset Doctor',
    subtitle: 'AI health monitoring & diagnostics',
    icon: 'heart-pulse',
    gradient: [COLORS.gradients.health[0], COLORS.gradients.health[1]],
    screen: 'AssetDoctor',
  },
  {
    id: '3',
    title: 'Voice Inspector',
    subtitle: 'Hands-free AI assistant',
    icon: 'microphone',
    gradient: [COLORS.gradients.voice[0], COLORS.gradients.voice[1]],
    screen: 'VoiceInspector',
  },
  {
    id: '4',
    title: 'Insights & Analytics',
    subtitle: 'Real-time dashboards & reports',
    icon: 'chart-line',
    gradient: [COLORS.gradients.analytics[0], COLORS.gradients.analytics[1]],
    badge: 'New',
    screen: 'InsightsAnalytics',
  },
  {
    id: '5',
    title: 'Reports & Export',
    subtitle: 'PDF, Excel, CSV generation',
    icon: 'file-document-multiple',
    gradient: [COLORS.gradients.reports[0], COLORS.gradients.reports[1]],
    screen: 'ReportsExport',
  },
  {
    id: '6',
    title: 'Team Management',
    subtitle: 'Multi-user collaboration',
    icon: 'account-group',
    gradient: [COLORS.gradients.team[0], COLORS.gradients.team[1]],
    screen: 'TeamManagement',
  },
  {
    id: '7',
    title: 'Notifications Center',
    subtitle: 'Smart alerts & reminders',
    icon: 'bell-alert',
    gradient: [COLORS.gradients.notifications[0], COLORS.gradients.notifications[1]],
    badge: '12',
    screen: 'NotificationsCenter',
  },
  {
    id: '8',
    title: 'Profile & Settings',
    subtitle: 'Account, preferences & security',
    icon: 'account-cog',
    gradient: [COLORS.gradients.settings[0], COLORS.gradients.settings[1]],
    screen: 'ProfileSettings',
  },
] as const;

export const QUICK_STATS: readonly QuickStat[] = [
  { label: 'Active Assets', value: '247', color: COLORS.status.online },
  { label: 'Critical Issues', value: '8', color: COLORS.status.error },
  { label: 'Savings MTD', value: '$45.2K', color: COLORS.status.warning },
  { label: 'AI Accuracy', value: '94.3%', color: COLORS.status.info },
] as const;

export const SYSTEM_STATUSES: readonly SystemStatus[] = [
  { label: 'API', status: 'online' },
  { label: 'Database', status: 'online' },
  { label: 'AI Models', status: 'online' },
  { label: 'Sync', status: 'synced' },
] as const;