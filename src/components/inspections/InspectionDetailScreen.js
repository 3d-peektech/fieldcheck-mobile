import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { inspectionsAPI } from '../../api/inspections';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import colors from '../../theme/colors';
import { INSPECTION_STATUS, CONDITIONS } from '../../utils/constants';

const InspectionDetailScreen = ({ route, navigation }) => {
  const { inspectionId } = route.params;
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInspection();
  }, [inspectionId]);

  const loadInspection = async () => {
    try {
      setError(null);
      const response = await inspectionsAPI.getInspection(inspectionId);
      if (response.success) {
        setInspection(response.inspection);
      }
    } catch (err) {
      setError(err.message || 'Failed to load inspection details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Inspection',
      'Are you sure you want to delete this inspection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await inspectionsAPI.deleteInspection(inspectionId);
              Alert.alert('Success', 'Inspection deleted successfully');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete inspection');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInspection();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={loadInspection} />;
  if (!inspection) return <ErrorMessage message="Inspection not found" />;

  const statusConfig = INSPECTION_STATUS.find((s) => s.value === inspection.status) || INSPECTION_STATUS[0];
  const conditionConfig = CONDITIONS.find((c) => c.value === inspection.overallCondition);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.number}>{inspection.inspectionNumber}</Text>
          <Text style={styles.date}>
            {new Date(inspection.inspectionDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: statusConfig.color + '20' }]}>
            <Text style={[styles.badgeText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          {inspection.overallCondition && (
            <View style={[styles.badge, { backgroundColor: conditionConfig?.color + '20' }]}>
              <Text style={[styles.badgeText, { color: conditionConfig?.color }]}>
                {conditionConfig?.label}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Asset Info */}
      {inspection.asset && (
        <Card>
          <Text style={styles.cardTitle}>Asset Information</Text>
          <TouchableOpacity
            style={styles.assetLink}
            onPress={() =>
              navigation.navigate('Assets', {
                screen: 'AssetDetail',
                params: { assetId: inspection.asset.id },
              })
            }
          >
            <View style={styles.assetInfo}>
              <Ionicons name="cube" size={40} color={colors.primary} />
              <View style={styles.assetDetails}>
                <Text style={styles.assetName}>{inspection.asset.name}</Text>
                <Text style={styles.assetTag}>{inspection.asset.assetTag}</Text>
                {inspection.asset.location && (
                  <Text style={styles.assetLocation}>{inspection.asset.location}</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
      )}

      {/* Inspector Info */}
      {inspection.inspector && (
        <Card>
          <Text style={styles.cardTitle}>Inspector</Text>
          <View style={styles.inspectorInfo}>
            <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
            <View style={styles.inspectorDetails}>
              <Text style={styles.inspectorName}>
                {inspection.inspector.firstName} {inspection.inspector.lastName}
              </Text>
              <Text style={styles.inspectorRole}>{inspection.inspector.role}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Inspection Details */}
      <Card>
        <Text style={styles.cardTitle}>Inspection Details</Text>
        {inspection.priority && (
          <InfoRow icon="flag-outline" label="Priority" value={inspection.priority} />
        )}
        {inspection.duration && (
          <InfoRow icon="time-outline" label="Duration" value={`${inspection.duration} minutes`} />
        )}
        {inspection.completedAt && (
          <InfoRow
            icon="checkmark-circle-outline"
            label="Completed"
            value={new Date(inspection.completedAt).toLocaleString()}
          />
        )}
        {inspection.score !== null && inspection.score !== undefined && (
          <InfoRow icon="star-outline" label="Score" value={`${inspection.score}/100`} />
        )}
      </Card>

      {/* Findings */}
      {inspection.findings && (
        <Card>
          <Text style={styles.cardTitle}>Findings</Text>
          <Text style={styles.text}>{inspection.findings}</Text>
        </Card>
      )}

      {/* Recommendations */}
      {inspection.recommendations && (
        <Card>
          <Text style={styles.cardTitle}>Recommendations</Text>
          <Text style={styles.text}>{inspection.recommendations}</Text>
        </Card>
      )}

      {/* Checklist */}
      {inspection.checklist && inspection.checklist.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Checklist</Text>
          {inspection.checklist.map((item, index) => (
            <View key={index} style={styles.checklistItem}>
              <Ionicons
                name={item.checked ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={item.checked ? colors.success : colors.textLight}
              />
              <Text style={[styles.checklistText, item.checked && styles.checklistTextChecked]}>
                {item.text || item.name || item}
              </Text>
            </View>
          ))}
        </Card>
      )}

      {/* Attachments */}
      {inspection.attachments && inspection.attachments.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Attachments ({inspection.attachments.length})</Text>
          <View style={styles.attachments}>
            {inspection.attachments.map((attachment, index) => (
              <TouchableOpacity key={index} style={styles.attachment}>
                <Image source={{ uri: attachment.url }} style={styles.attachmentImage} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      {/* Notes */}
      {inspection.notes && (
        <Card>
          <Text style={styles.cardTitle}>Notes</Text>
          <Text style={styles.text}>{inspection.notes}</Text>
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {inspection.status !== 'completed' && (
          <Button
            title="Continue Inspection"
            onPress={() =>
              navigation.navigate('InspectionForm', { inspectionId: inspection.id })
            }
            style={styles.actionButton}
          />
        )}
        <Button
          title="Edit Inspection"
          onPress={() => Alert.alert('Edit', 'Edit functionality coming soon')}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Delete Inspection"
          onPress={handleDelete}
          variant="outline"
          style={[styles.actionButton, styles.deleteButton]}
        />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.infoLabelText}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  assetLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assetDetails: {
    marginLeft: 12,
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  assetTag: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  assetLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  inspectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectorDetails: {
    marginLeft: 12,
  },
  inspectorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  inspectorRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabelText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checklistText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  checklistTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  attachments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attachment: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});

export default InspectionDetailScreen;