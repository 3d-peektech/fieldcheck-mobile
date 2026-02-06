import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import colors from '../../theme/colors';
import { INSPECTION_STATUS, CONDITIONS } from '../../utils/constants';

const InspectionCard = ({ inspection, onPress }) => {
  const statusConfig = INSPECTION_STATUS.find((s) => s.value === inspection.status) || INSPECTION_STATUS[0];
  const conditionConfig = CONDITIONS.find((c) => c.value === inspection.overallCondition);

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.number}>{inspection.inspectionNumber}</Text>
          <Text style={styles.date}>
            {new Date(inspection.inspectionDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {inspection.asset && (
        <View style={styles.assetInfo}>
          <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.assetName}>{inspection.asset.name}</Text>
          <Text style={styles.assetTag}>({inspection.asset.assetTag})</Text>
        </View>
      )}

      {inspection.inspector && (
        <View style={styles.inspectorInfo}>
          <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.inspectorName}>
            {inspection.inspector.firstName} {inspection.inspector.lastName}
          </Text>
        </View>
      )}

      {inspection.overallCondition && (
        <View style={styles.footer}>
          <Text style={styles.conditionLabel}>Condition:</Text>
          <View
            style={[
              styles.conditionBadge,
              { backgroundColor: conditionConfig?.color + '20' || colors.textLight + '20' },
            ]}
          >
            <Text
              style={[
                styles.conditionText,
                { color: conditionConfig?.color || colors.text },
              ]}
            >
              {conditionConfig?.label || inspection.overallCondition}
            </Text>
          </View>
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
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
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
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '600',
  },
  assetTag: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  inspectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inspectorName: {
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
  conditionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  conditionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default InspectionCard;