// screens/MainMenuScreen/components/SystemStatusPanel.tsx
import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { StatusItem } from './StatusItem';
import { SYSTEM_STATUSES } from '../../../config/menuData';
import { COLORS } from '../../../constants/theme';
import { styles } from '../styles';

export const SystemStatusPanel: React.FC = React.memo(() => (
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