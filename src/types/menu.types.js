// types/menu.types.ts
export type MenuItemId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type ScreenName =
  | 'FinancialAI'
  | 'AssetDoctor'
  | 'VoiceInspector'
  | 'InsightsAnalytics'
  | 'ReportsExport'
  | 'TeamManagement'
  | 'NotificationsCenter'
  | 'ProfileSettings'
  | 'Dashboard';

export interface MenuItem {
  id: MenuItemId;
  title: string;
  subtitle: string;
  icon: string;
  gradient: readonly [string, string];
  badge?: string;
  screen: ScreenName;
}

export interface QuickStat {
  label: string;
  value: string;
  color: string;
}

export type SystemStatusType = 'online' | 'offline' | 'synced' | 'warning';

export interface SystemStatus {
  label: string;
  status: SystemStatusType;
}

// Navigation types (extend based on your navigation setup)
export interface MainMenuNavigationProp {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  // Add other navigation methods as needed
}

export interface MainMenuScreenProps {
  navigation: MainMenuNavigationProp;
}