import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { inspectionsAPI } from '../../api/inspections';
import { assetsAPI } from '../../api/assets';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import colors from '../../theme/colors';

const CreateInspectionScreen = ({ route, navigation }) => {
  const { assetId: routeAssetId } = route.params || {};
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [formData, setFormData] = useState({
    assetId: routeAssetId || '',
    scheduledDate: '',
    priority: 'medium',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const response = await assetsAPI.getAssets({ limit: 100, status: 'active' });
      if (response.success) {
        setAssets(response.assets);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load assets');
    } finally {
      setLoadingAssets(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.assetId) {
      newErrors.assetId = 'Please select an asset';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await inspectionsAPI.createInspection({
        assetId: formData.assetId,
        scheduledDate: formData.scheduledDate || null,
        priority: formData.priority,
        notes: formData.notes || null,
        status: 'scheduled',
      });

      if (response.success) {
        Alert.alert('Success', 'Inspection created successfully', [
          {
            text: 'Start Now',
            onPress: () =>
              navigation.replace('InspectionForm', {
                inspectionId: response.inspection.id,
              }),
          },
          {
            text: 'View Details',
            onPress: () =>
              navigation.replace('InspectionDetail', {
                inspectionId: response.inspection.id,
              }),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create inspection');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAssets) return <Loading text="Loading assets..." />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Asset *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.assetId}
                onValueChange={(value) => updateField('assetId', value)}
                style={styles.picker}
              >
                <Picker.Item label="Choose an asset..." value="" />
                {assets.map((asset) => (
                  <Picker.Item
                    key={asset.id}
                    label={`${asset.name} (${asset.assetTag})`}
                    value={asset.id}
                  />
                ))}
              </Picker>
            </View>
            {errors.assetId && <Text style={styles.errorText}>{errors.assetId}</Text>}
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.priority}
                onValueChange={(value) => updateField('priority', value)}
                style={styles.picker}
              >
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Urgent" value="urgent" />
              </Picker>
            </View>
          </View>

          <Input
            label="Scheduled Date (Optional)"
            value={formData.scheduledDate}
            onChangeText={(text) => updateField('scheduledDate', text)}
            placeholder="YYYY-MM-DD"
          />

          <Input
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(text) => updateField('notes', text)}
            placeholder="Add any notes..."
            multiline
            numberOfLines={4}
          />

          <Button title="Create Inspection" onPress={handleSubmit} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});

export default CreateInspectionScreen;