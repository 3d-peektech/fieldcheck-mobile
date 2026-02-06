// screens/MainMenuScreen/components/StatCard.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { QuickStat } from '../../../types/menu.types';
import { styles } from '../styles';

interface StatCardProps {
  stat: QuickStat;
}

export const StatCard: React.FC<StatCardProps> = React.memo(({ stat }) => (
  <View 
    style={styles.statCard}
    accessibilityLabel={`${stat.label}: ${stat.value}`}
    accessibilityRole="text"
  >
    <Text style={styles.statValue}>{stat.value}</Text>
    <Text style={styles.statLabel}>{stat.label}</Text>
    <View style={[styles.statIndicator, { backgroundColor: stat.color }]} />
  </View>
));

StatCard.displayName = 'StatCard';