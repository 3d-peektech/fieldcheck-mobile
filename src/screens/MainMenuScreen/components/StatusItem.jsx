// screens/MainMenuScreen/components/StatusItem.tsx
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

import { SystemStatusType } from '../../../types/menu.types';
import { getStatusColor } from '../../../utils/helpers';
import { styles } from '../styles';

interface StatusItemProps {
  label: string;
  status: SystemStatusType;
}

export const StatusItem: React.FC<StatusItemProps> = React.memo(
  ({ label, status }) => {
    const statusColor = useMemo(() => getStatusColor(status), [status]);

    return (
      <View 
        style={styles.statusItem}
        accessibilityLabel={`${label} status: ${status}`}
        accessibilityRole="text"
      >
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.statusLabel}>{label}</Text>
      </View>
    );
  }
);

StatusItem.displayName = 'StatusItem';