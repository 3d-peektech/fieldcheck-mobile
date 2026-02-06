import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import colors from '../../theme/colors';
import { ASSET_STATUS } from '../../utils/constants';

const AssetCard = ({ asset, onPress }) => {
  const statusConfig = ASSET_STATUS.find((s) => s.value === asset.status) || ASSET_STATUS[0];

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.tag}>{asset.assetTag}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{asset.category || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{asset.location || 'No location'}</Text>
        </View>

        {asset.manufacturer && (
          <View style={styles.detailRow}>
            <Ionicons name="build-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {asset.manufacturer} {asset.model}
            </Text>
          </View>
        )}
      </View>

      {asset.nextInspectionDate && (
        <View style={styles.footer}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.footerText}>
            Next Inspection: {new Date(asset.nextInspectionDate).toLocaleDateString()}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  tag: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});

export default AssetCard;