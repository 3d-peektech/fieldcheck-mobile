import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { assetsAPI } from '../../api/assets';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import colors from '../../theme/colors';
import { ASSET_CATEGORIES, ASSET_STATUS, CONDITIONS } from '../../utils/constants';

const CreateAssetScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    assetTag: '',
    category: 'other',
    manufacturer: '',
    model: '',
    serialNumber: '',
    location: '',
    building: '',
    floor: '',
    room: '',
    status: 'active',
    condition: 'good',
    purchaseDate: '',
    purchasePrice: '',
    warrantyExpiry: '',
    inspectionFrequency: '90',
    notes: '',
    criticality: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Asset name is required';
    }

    if (!formData.assetTag.trim()) {
      newErrors.assetTag = 'Asset tag is required';
    }

    if (formData.inspectionFrequency && isNaN(formData.inspectionFrequency)) {
      newErrors.inspectionFrequency = 'Must be a number';
    }

    if (formData.purchasePrice && isNaN(formData.purchasePrice)) {
      newErrors.purchasePrice = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        inspectionFrequency: parseInt(formData.inspectionFrequency) || 90,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
        purchaseDate: formData.purchaseDate || null,
        warrantyExpiry: formData.warrantyExpiry || null,
      };

      const response = await assetsAPI.createAsset(data);

      if (response.success) {
        Alert.alert('Success', 'Asset created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Input
            label="Asset Name *"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Enter asset name"
            error={errors.name}
          />

          <Input
            label="Asset Tag *"
            value={formData.assetTag}
            onChangeText={(text) => updateField('assetTag', text)}
            placeholder="e.g., HVAC-001"
            error={errors.assetTag}
          />

          <View style={styles.pickerContainer}>
            <Input
              label="Category"
              value={formData.category}
              editable={false}
              style={{ marginBottom: 0 }}
            />
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => updateField('category', value)}
              style={styles.picker}
            >
              {ASSET_CATEGORIES.map((cat) => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>

          <Input
            label="Manufacturer"
            value={formData.manufacturer}
            onChangeText={(text) => updateField('manufacturer', text)}
            placeholder="Enter manufacturer"
          />

          <Input
            label="Model"
            value={formData.model}
            onChangeText={(text) => updateField('model', text)}
            placeholder="Enter model"
          />

          <Input
            label="Serial Number"
            value={formData.serialNumber}
            onChangeText={(text) => updateField('serialNumber', text)}
            placeholder="Enter serial number"
          />

          <Input
            label="Location"
            value={formData.location}
            onChangeText={(text) => updateField('location', text)}
            placeholder="Enter location"
          />

          <Input
            label="Building"
            value={formData.building}
            onChangeText={(text) => updateField('building', text)}
            placeholder="Enter building"
          />

          <Input
            label="Floor"
            value={formData.floor}
            onChangeText={(text) => updateField('floor', text)}
            placeholder="Enter floor"
          />

          <Input
            label="Room"
            value={formData.room}
            onChangeText={(text) => updateField('room', text)}
            placeholder="Enter room"
          />

          <View style={styles.pickerContainer}>
            <Input label="Status" value={formData.status} editable={false} style={{ marginBottom: 0 }} />
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => updateField('status', value)}
              style={styles.picker}
            >
              {ASSET_STATUS.map((status) => (
                <Picker.Item key={status.value} label={status.label} value={status.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Input
              label="Condition"
              value={formData.condition}
              editable={false}
              style={{ marginBottom: 0 }}
            />
            <Picker
              selectedValue={formData.condition}
              onValueChange={(value) => updateField('condition', value)}
              style={styles.picker}
            >
              {CONDITIONS.map((cond) => (
                <Picker.Item key={cond.value} label={cond.label} value={cond.value} />
              ))}
            </Picker>
          </View>

          <Input
            label="Purchase Price"
            value={formData.purchasePrice}
            onChangeText={(text) => updateField('purchasePrice', text)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.purchasePrice}
          />

          <Input
            label="Inspection Frequency (days)"
            value={formData.inspectionFrequency}
            onChangeText={(text) => updateField('inspectionFrequency', text)}
            placeholder="90"
            keyboardType="number-pad"
            error={errors.inspectionFrequency}
          />

          <Input
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => updateField('notes', text)}
            placeholder="Additional notes..."
            multiline
            numberOfLines={4}
          />

          <Button title="Create Asset" onPress={handleSubmit} loading={loading} />
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
    position: 'relative',
  },
  picker: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    opacity: 0,
    height: 48,
  },
});

export default CreateAssetScreen;