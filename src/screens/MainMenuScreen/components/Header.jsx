// screens/MainMenuScreen/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { StatCard } from './StatCard';
import { QUICK_STATS } from '../../../config/menuData';
import { COLORS } from '../../../constants/theme';
import { styles } from '../styles';

interface HeaderProps {
  onSyncPress: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ onSyncPress }) => (
  <LinearGradient 
    colors={[COLORS.primary, COLORS.primaryDark]} 
    style={styles.header}
  >
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
        accessibilityHint="Synchronize your data with the server"
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