import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ==================== TYPES ====================
interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: readonly [string, string];
  badge?: string;
  screen: string;
}

interface QuickStat {
  label: string;
  value: string;
  color: string;
}

interface SystemStatus {
  label: string;
  status: 'online' | 'offline' | 'synced' | 'warning';
}

interface MainMenuScreenProps {
  navigation: any; // Replace with proper navigation type from @react-navigation/native
}

// ==================== CONSTANTS ====================
const COLORS = {
  primary: '#0F9D58',
  primaryDark: '#0B7F46',
  background: '#f5f5f5',
  white: '#fff',
  text: {
    primary: '#333',
    secondary: '#666',
    tertiary: '#999',
  },
  status: {
    online: '#0F9D58',
    warning: '#F4B400',
    error: '#DB4437',
  },
} as const;

const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: '1',
    title: 'Financial AI Predictor',
    subtitle: 'Real-time ROI & cost analysis',
    icon: 'cash-multiple',
    gradient: ['#0F9D58', '#0B7F46'] as const,
    badge: 'Live',
    screen: 'FinancialAI',
  },
  {
    id: '2',
    title: 'Asset Doctor',
    subtitle: 'AI health monitoring & diagnostics',
    icon: 'heart-pulse',
    gradient: ['#DB4437', '#C1351D'] as const,
    screen: 'AssetDoctor',
  },
  {
    id: '3',
    title: 'Voice Inspector',
    subtitle: 'Hands-free AI assistant',
    icon: 'microphone',
    gradient: ['#4285F4', '#3367D6'] as const,
    screen: 'VoiceInspector',
  },
  {
    id: '4',
    title: 'Insights & Analytics',
    subtitle: 'Real-time dashboards & reports',
    icon: 'chart-line',
    gradient: ['#F4B400', '#DB9200'] as const,
    badge: 'New',
    screen: 'InsightsAnalytics',
  },
  {
    id: '5',
    title: 'Reports & Export',
    subtitle: 'PDF, Excel, CSV generation',
    icon: 'file-document-multiple',
    gradient: ['#9C27B0', '#7B1FA2'] as const,
    screen: 'ReportsExport',
  },
  {
    id: '6',
    title: 'Team Management',
    subtitle: 'Multi-user collaboration',
    icon: 'account-group',
    gradient: ['#00BCD4', '#0097A7'] as const,
    screen: 'TeamManagement',
  },
  {
    id: '7',
    title: 'Notifications Center',
    subtitle: 'Smart alerts & reminders',
    icon: 'bell-alert',
    gradient: ['#FF5722', '#E64A19'] as const,
    badge: '12',
    screen: 'NotificationsCenter',
  },
  {
    id: '8',
    title: 'Profile & Settings',
    subtitle: 'Account, preferences & security',
    icon: 'account-cog',
    gradient: ['#607D8B', '#455A64'] as const,
    screen: 'ProfileSettings',
  },
] as const;

const QUICK_STATS: readonly QuickStat[] = [
  { label: 'Active Assets', value: '247', color: '#0F9D58' },
  { label: 'Critical Issues', value: '8', color: '#DB4437' },
  { label: 'Savings MTD', value: '$45.2K', color: '#F4B400' },
  { label: 'AI Accuracy', value: '94.3%', color: '#4285F4' },
] as const;

const SYSTEM_STATUSES: readonly SystemStatus[] = [
  { label: 'API', status: 'online' },
  { label: 'Database', status: 'online' },
  { label: 'AI Models', status: 'online' },
  { label: 'Sync', status: 'synced' },
] as const;

// ==================== SUB-COMPONENTS ====================
interface HeaderProps {
  onSyncPress: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({ onSyncPress }) => (
  <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
    <View style={styles.headerContent}>
      <View>
        <Text style={styles.headerTitle}>FieldCheck AI</Text>
        <Text style={styles.headerSubtitle}>Production Dashboard</Text>
      </View>
      <TouchableOpacity 
        style={styles.syncButton}
        onPress={onSyncPress}
        accessibilityLabel="Sync data"
        accessibilityRole="button"
      >
        <Icon name="sync" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>

    <View style={styles.statsContainer}>
      {QUICK_STATS.map((stat, index) => (
        <StatCard key={`stat-${index}`} stat={stat} />
      ))}
    </View>
  </LinearGradient>
));

Header.displayName = 'Header';

interface StatCardProps {
  stat: QuickStat;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ stat }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{stat.value}</Text>
    <Text style={styles.statLabel}>{stat.label}</Text>
    <View style={[styles.statIndicator, { backgroundColor: stat.color }]} />
  </View>
));

StatCard.displayName = 'StatCard';

interface MenuItemCardProps {
  item: MenuItem;
  onPress: (screen: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item.screen);
  }, [item.screen, onPress]);

  return (
    <TouchableOpacity
      style={styles.menuItemWrapper}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={`${item.title}: ${item.subtitle}`}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={[...item.gradient]}
        style={styles.menuItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.menuItemContent}>
          <Icon name={item.icon} size={36} color={COLORS.white} />
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.menuItemSubtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

MenuItemCard.displayName = 'MenuItemCard';

interface StatusItemProps {
  label: string;
  status: SystemStatus['status'];
}

const StatusItem: React.FC<StatusItemProps> = React.memo(({ label, status }) => {
  const statusColor = useMemo(() => {
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
  }, [status]);

  return (
    <View style={styles.statusItem}>
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
});

StatusItem.displayName = 'StatusItem';

const SystemStatusPanel: React.FC = React.memo(() => (
  <View style={styles.systemStatus}>
    <View style={styles.statusHeader}>
      <Icon name="server-network" size={20} color={COLORS.primary} />
      <Text style={styles.statusTitle}>System Status</Text>
    </View>
    <View style={styles.statusGrid}>
      {SYSTEM_STATUSES.map((item) => (
        <StatusItem key={item.label} label={item.label} status={item.status} />
      ))}
    </View>
    <Text style={styles.lastUpdate}>Last updated: Just now</Text>
  </View>
));

SystemStatusPanel.displayName = 'SystemStatusPanel';

// ==================== MAIN COMPONENT ====================
const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ navigation }) => {
  const handleNavigation = useCallback(
    (screen: string) => {
      navigation.navigate(screen);
    },
    [navigation]
  );

  const handleSync = useCallback(() => {
    // TODO: Implement sync logic
    console.log('Sync triggered');
  }, []);

  const menuGrid = useMemo(
    () =>
      MENU_ITEMS.map((item) => (
        <MenuItemCard key={item.id} item={item} onPress={handleNavigation} />
      )),
    [handleNavigation]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <Header onSyncPress={handleSync} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.menuGrid}>{menuGrid}</View>

        <SystemStatusPanel />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  syncButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 60,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
  },
  statIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
  },
  menuItemWrapper: {
    width: '47%',
    marginBottom: 5,
  },
  menuItem: {
    borderRadius: 20,
    padding: 20,
    height: 160,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
  },
  systemStatus: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: '45%',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  lastUpdate: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginTop: 12,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default MainMenuScreen;