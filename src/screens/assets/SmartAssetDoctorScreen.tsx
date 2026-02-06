import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { AIVisionService } from '../services/AIVisionService';

interface DiagnosisResult {
  problem: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  solution: string;
  estimatedCost: number;
  confidence: number;
  detectedIssues: string[];
  partToReplace?: string;
  urgency: string;
}

const SmartAssetDoctorScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setDiagnosis(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is needed');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setDiagnosis(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo first');
      return;
    }

    setAnalyzing(true);
    try {
      // Simulate AI analysis (replace with actual API call)
      const result = await AIVisionService.analyzeAssetImage(selectedImage);
      setDiagnosis(result);
    } catch (error) {
      Alert.alert('Analysis Failed', 'Could not analyze the image');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return ['#ef4444', '#dc2626'];
      case 'high':
        return ['#f97316', '#ea580c'];
      case 'medium':
        return ['#f59e0b', '#d97706'];
      case 'low':
        return ['#10b981', '#059669'];
      default:
        return ['#6b7280', '#4b5563'];
    }
  };

  const generateReport = () => {
    if (!diagnosis) return;
    
    Alert.alert(
      'Report Generated',
      'Technical report has been created and saved to your documents',
      [
        { text: 'View Report', onPress: () => navigation.navigate('Reports') },
        { text: 'OK' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.header}>
        <Text style={styles.headerTitle}>🔬 Smart Asset Doctor</Text>
        <Text style={styles.headerSubtitle}>
          AI-Powered Visual Diagnosis
        </Text>
      </LinearGradient>

      {/* Image Capture Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📸 Capture Asset Image</Text>
        
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.captureButtons}>
            <TouchableOpacity
              style={[styles.captureButton, { backgroundColor: '#dbeafe' }]}
              onPress={takePhoto}
            >
              <Text style={styles.captureIcon}>📷</Text>
              <Text style={styles.captureText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, { backgroundColor: '#f3e8ff' }]}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.captureIcon}>🖼️</Text>
              <Text style={styles.captureText}>From Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedImage && !diagnosis && (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeImage}
            disabled={analyzing}
          >
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.analyzeGradient}
            >
              {analyzing ? (
                <>
                  <ActivityIndicator color="#ffffff" />
                  <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.analyzeIcon}>✨</Text>
                  <Text style={styles.analyzeButtonText}>
                    Analyze with AI
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Diagnosis Results */}
      {diagnosis && (
        <>
          {/* Severity Card */}
          <View style={styles.section}>
            <LinearGradient
              colors={getSeverityColor(diagnosis.severity)}
              style={styles.severityCard}
            >
              <View style={styles.severityHeader}>
                <Text style={styles.severityLabel}>SEVERITY</Text>
                <Text style={styles.confidenceText}>
                  {Math.round(diagnosis.confidence * 100)}% Confidence
                </Text>
              </View>
              <Text style={styles.severityValue}>
                {diagnosis.severity.toUpperCase()}
              </Text>
              <Text style={styles.urgencyText}>⏰ {diagnosis.urgency}</Text>
            </LinearGradient>
          </View>

          {/* Problem Detected */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Problem Detected</Text>
            <View style={styles.card}>
              <Text style={styles.problemTitle}>{diagnosis.problem}</Text>
              <View style={styles.divider} />
              <Text style={styles.issuesTitle}>Detected Issues:</Text>
              {diagnosis.detectedIssues.map((issue, index) => (
                <View key={index} style={styles.issueItem}>
                  <Text style={styles.issueBullet}>•</Text>
                  <Text style={styles.issueText}>{issue}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Solution */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Recommended Solution</Text>
            <View style={styles.card}>
              <Text style={styles.solutionText}>{diagnosis.solution}</Text>
              {diagnosis.partToReplace && (
                <View style={styles.partContainer}>
                  <Text style={styles.partLabel}>Part to Replace:</Text>
                  <Text style={styles.partValue}>{diagnosis.partToReplace}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Cost Estimate */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Cost Estimate</Text>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.costCard}
            >
              <Text style={styles.costLabel}>Estimated Repair Cost</Text>
              <Text style={styles.costValue}>
                ${diagnosis.estimatedCost.toLocaleString()}
              </Text>
              <Text style={styles.costNote}>
                ⚠️ Delaying repair may increase costs by 40-60%
              </Text>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={generateReport}
            >
              <Text style={styles.reportButtonText}>📄 Generate Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.workOrderButton}
              onPress={() =>
                Alert.alert('Work Order', 'Creating work order...')
              }
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.workOrderGradient}
              >
                <Text style={styles.workOrderButtonText}>
                  ⚡ Create Work Order
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* New Analysis Button */}
          <TouchableOpacity
            style={styles.newAnalysisButton}
            onPress={() => {
              setSelectedImage(null);
              setDiagnosis(null);
            }}
          >
            <Text style={styles.newAnalysisText}>🔄 New Analysis</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e9d5ff',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  changeImageButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  captureButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  captureButton: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  captureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  captureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  analyzeButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyzeGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeIcon: {
    fontSize: 24,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  severityCard: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  severityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  severityLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  confidenceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  severityValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  urgencyText: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },
  issuesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  issueItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  issueBullet: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  solutionText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 24,
  },
  partContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  partLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  partValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  costCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  costLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  costValue: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  costNote: {
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  reportButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  reportButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
  },
  workOrderButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  workOrderGradient: {
    padding: 16,
    alignItems: 'center',
  },
  workOrderButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  newAnalysisButton: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  newAnalysisText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SmartAssetDoctorScreen;
