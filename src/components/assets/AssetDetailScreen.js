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
import * as ImagePicker from 'expo-image-picker';
import { assetsAPI } from '../../api/assets';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import colors from '../../theme/colors';
import { ASSET_STATUS, CONDITIONS } from '../../utils/constants';

const AssetDetailScreen = ({ route, navigation }) => {
  const { assetId } = route.params;
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadAsset();
  }, [assetId]);

  const loadAsset = async () => {
    try {
      setError(null);
      const response = await assetsAPI.getAsset(assetId);
      if (response.success) {
        setAsset(response.asset);
      }
    } catch (err) {
      setError(err.message || 'Failed to load asset details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploadingImage(true);
        const response = await assetsAPI.uploadImage(assetId, result.assets[0].uri);
        if (response.success) {
          setAsset(response.asset);
          Alert.alert('Success', 'Image uploaded successfully');
        }
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Asset',
      'Are you sure you want to delete this asset? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await assetsAPI.deleteAsset(assetId);
              Alert.alert('Success', 'Asset deleted successfully');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete asset');
            }
          },
        },
      ]
    );
  };

  const handleGenerateQR = async () => {
    try {
      const response = await assetsAPI.generateQRCode(assetId);
      if (response.success) {
        // Navigate to QR display or download
        Alert.alert('QR Code', 'QR code generated successfully');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to generate QR code');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAsset();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={loadAsset} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  const statusConfig = ASSET_STATUS.find((s) => s.value === asset.status) || ASSET_STATUS[0];
  const conditionConfig = CONDITIONS.find((c) => c.value === asset.condition) || CONDITIONS[1];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {asset.imageUrl ? (
          <Image source={{ uri: asset.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="cube-outline" size={64} color={colors.textLight} />
          </View>
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImageUpload}
          disabled={uploadingImage}
        >
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Header Info */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.tag}>{asset.assetTag}</Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: statusConfig.color + '20' }]}>
            <Text style={[styles.badgeText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: conditionConfig.color + '20' }]}>
            <Text style={[styles.badgeText, { color: conditionConfig.color }]}>
              {conditionConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Basic Information */}
      <Card>
        <Text style={styles.cardTitle}>Basic Information</Text>
        <InfoRow icon="business-outline" label="Category" value={asset.category || 'N/A'} />
        <InfoRow icon="location-outline" label="Location" value={asset.location || 'N/A'} />
        {asset.building && (
          <InfoRow icon="business-outline" label="Building" value={asset.building} />
        )}
        {asset.floor && <InfoRow icon="layers-outline" label="Floor" value={asset.floor} />}
        {asset.room && <InfoRow icon="door-open-outline" label="Room" value={asset.room} />}
      </Card>

      {/* Equipment Details */}
      {(asset.manufacturer || asset.model || asset.serialNumber) && (
        <Card>
          <Text style={styles.cardTitle}>Equipment Details</Text>
          {asset.manufacturer && (
            <InfoRow icon="build-outline" label="Manufacturer" value={asset.manufacturer} />
          )}
          {asset.model && <InfoRow icon="hardware-chip-outline" label="Model" value={asset.model} />}
          {asset.serialNumber && (
            <InfoRow icon="barcode-outline" label="Serial Number" value={asset.serialNumber} />
          )}
        </Card>
      )}

      {/* Inspection Information */}
      <Card>
        <Text style={styles.cardTitle}>Inspection Schedule</Text>
        <InfoRow
          icon="calendar-outline"
          label="Frequency"
          value={`Every ${asset.inspectionFrequency || 90} days`}
        />
        {asset.lastInspectionDate && (
          <InfoRow
            icon="checkmark-circle-outline"
            label="Last Inspection"
            value={new Date(asset.lastInspectionDate).toLocaleDateString()}
          />
        )}
        {asset.nextInspectionDate && (
          <InfoRow
            icon="alert-circle-outline"
            label="Next Inspection"
            value={new Date(asset.nextInspectionDate).toLocaleDateString()}
            valueColor={
              new Date(asset.nextInspectionDate) < new Date() ? colors.error : colors.text
            }
          />
        )}
      </Card>

      {/* Purchase Information */}
      {(asset.purchaseDate || asset.purchasePrice || asset.warrantyExpiry) && (
        <Card>
          <Text style={styles.cardTitle}>Purchase Information</Text>
          {asset.purchaseDate && (
            <InfoRow
              icon="cart-outline"
              label="Purchase Date"
              value={new Date(asset.purchaseDate).toLocaleDateString()}
            />
          )}
          {asset.purchasePrice && (
            <InfoRow
              icon="cash-outline"
              label="Purchase Price"
              value={`$${parseFloat(asset.purchasePrice).toFixed(2)}`}
            />
          )}
          {asset.warrantyExpiry && (
            <InfoRow
              icon="shield-checkmark-outline"
              label="Warranty Expiry"
              value={new Date(asset.warrantyExpiry).toLocaleDateString()}
            />
          )}
        </Card>
      )}

      {/* Notes */}
      {asset.notes && (
        <Card>
          <Text style={styles.cardTitle}>Notes</Text>
          <Text style={styles.notes}>{asset.notes}</Text>
        </Card>
      )}

      {/* Recent Inspections */}
      {asset.inspections && asset.inspections.length > 0 && (
        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Inspections</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Inspections', { screen: 'InspectionsList', params: { assetId } })
              }
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {asset.inspections.slice(0, 3).map((inspection) => (
            <TouchableOpacity
              key={inspection.id}
              style={styles.inspectionItem}
              onPress={() =>
                navigation.navigate('Inspections', {
                  screen: 'InspectionDetail',
                  params: { inspectionId: inspection.id },
                })
              }
            >
              <View style={styles.inspectionInfo}>
                <Text style={styles.inspectionNumber}>{inspection.inspectionNumber}</Text>
                <Text style={styles.inspectionDate}>
                  {new Date(inspection.inspectionDate).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={[
                  styles.inspectionStatus,
                  {
                    backgroundColor:
                      inspection.status === 'completed'
                        ? colors.success + '20'
                        : colors.warning + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.inspectionStatusText,
                    { color: inspection.status === 'completed' ? colors.success : colors.warning },
                  ]}
                >
                  {inspection.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Create Inspection"
          onPress={() =>
            navigation.navigate('Inspections', {
              screen: 'CreateInspection',
              params: { assetId },
            })
          }
          style={styles.actionButton}
        />
        <Button
          title="Generate QR Code"
          onPress={handleGenerateQR}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Edit Asset"
          onPress={() => Alert.alert('Edit', 'Edit functionality coming soon')}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Delete Asset"
          onPress={handleDelete}
          variant="outline"
          style={[styles.actionButton, styles.deleteButton]}
        />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value, valueColor = colors.text }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.infoLabelText}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  tag: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
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
    flex: 1,
    textAlign: 'right',
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  inspectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inspectionInfo: {
    flex: 1,
  },
  inspectionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  inspectionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  inspectionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inspectionStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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

export default AssetDetailScreen;