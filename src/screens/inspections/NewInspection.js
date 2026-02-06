import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const NewInspection = ({ navigation }) => {
  const [assetId, setAssetId] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const inspectionTypes = [
    { id: 'routine', name: 'Routine Inspection', icon: '🔄' },
    { id: 'safety', name: 'Safety Inspection', icon: '⚠️' },
    { id: 'maintenance', name: 'Maintenance Check', icon: '🔧' },
    { id: 'quality', name: 'Quality Assurance', icon: '✓' },
  ];

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Required', 'Please select an inspection type');
      return;
    }

    if (!assetId.trim()) {
      Alert.alert('Required', 'Please enter an asset ID');
      return;
    }

    Alert.alert(
      'Success',
      'Inspection created successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>New Inspection</Text>
        <Text style={styles.subtitle}>Create a new asset inspection</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspection Type</Text>
        <View style={styles.typeGrid}>
          {inspectionTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                selectedType === type.id && styles.typeCardSelected,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.typeName,
                  selectedType === type.id && styles.typeNameSelected,
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asset Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Asset ID *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter asset ID or scan QR code"
              value={assetId}
              onChangeText={setAssetId}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate('ScanAsset')}
            >
              <Text style={styles.scanButtonText}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any additional notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspection Checklist</Text>
        
        <View style={styles.checklistInfo}>
          <Text style={styles.checklistIcon}>📋</Text>
          <View style={styles.checklistContent}>
            <Text style={styles.checklistTitle}>
              Checklist will be loaded based on:
            </Text>
            <Text style={styles.checklistText}>
              • Asset type{'\n'}
              • Inspection type{'\n'}
              • Company standards
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Start Inspection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  typeIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  typeNameSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  scanButton: {
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scanButtonText: {
    fontSize: 24,
  },
  checklistInfo: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
  },
  checklistIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  checklistContent: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  checklistText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewInspection;
