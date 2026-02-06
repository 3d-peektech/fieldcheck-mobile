// screens/MainMenuScreen/index.tsx
import React, { useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { Header } from './components/Header';
import { MenuGrid } from './components/MenuGrid';
import { SystemStatusPanel } from './components/SystemStatusPanel';
import { MENU_ITEMS } from '../../config/menuData';
import { MainMenuScreenProps } from '../../types/menu.types';
import { trackEvent } from '../../utils/helpers';
import { styles } from './styles';
import { COLORS } from '../../constants/theme';

/**
 * MainMenuScreen - Production-grade main dashboard
 * 
 * Features:
 * - Modular component architecture
 * - Type-safe navigation
 * - Performance optimized with React.memo and useCallback
 * - Accessibility support
 * - Analytics tracking ready
 * - Scalable and maintainable code structure
 */
const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ navigation }) => {
  /**
   * Handle navigation to different screens
   */
  const handleNavigation = useCallback(
    (screen: string) => {
      trackEvent('menu_item_pressed', { screen });
      navigation.navigate(screen as any);
    },
    [navigation]
  );

  /**
   * Handle sync action
   */
  const handleSync = useCallback(() => {
    trackEvent('sync_pressed');
    // TODO: Implement actual sync logic
    // Could dispatch a Redux action or call an API
    console.log('Sync triggered');
  }, []);

  /**
   * Memoized menu items to prevent unnecessary re-renders
   */
  const menuItems = useMemo(() => MENU_ITEMS, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.primaryDark} 
      />

      <Header onSyncPress={handleSync} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <MenuGrid items={menuItems} onItemPress={handleNavigation} />

        <SystemStatusPanel />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainMenuScreen;