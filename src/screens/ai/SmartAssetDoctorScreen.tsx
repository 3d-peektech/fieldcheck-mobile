import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import GeminiAIService from '../../services/GeminiAIService';

interface DiagnosisIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  location: string;
  description: string;
  recommendation: string;
  confidence: number;
}

interface DiagnosisResult {
  id: string;
  timestamp: string;
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  confidence: number;
  issues: DiagnosisIssue[];
  recommendations: string[];
  estimated_cost: number;
  urgency: 'immediate' | 'high' | 'medium' | 'low';
  analysis_duration: number;
}

const SmartAssetDoctorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const [cameraPermission, libraryPermission] = await Promise.all([
        ImagePicker.requestCameraPermissionsAsync(),
        ImagePicker.requestMediaLibraryPermissionsAsync(),
      ]);

      const granted = cameraPermission.status === 'granted' && libraryPermission.status === 'granted';
      setPermissionGranted(granted);

      if (!granted) {
        Alert.alert(
          'Permissions Required',
          'Camera and photo library access are required for AI-powered asset diagnosis.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Grant Access', onPress: requestPermissions },
          ]
        );
      }
    } catch (error) {
      console.error('[Permissions] Request failed:', error);
    }
  };

  const selectImageFromCamera = async () => {
    if (!permissionGranted) {
      await requestPermissions();
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
        setDiagnosisResult(null);
      }
    } catch (error) {
      console.error('[Camera] Error:', error);
      Alert.alert('Camera Error', 'Unable to access camera. Please try again.');
    }
  };

  const selectImageFromLibrary = async () => {
    if (!permissionGranted) {
      await requestPermissions();
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
        setDiagnosisResult(null);
      }
    } catch (error) {
      console.error('[Library] Error:', error);
      Alert.alert('Library Error', 'Unable to access photo library. Please try again.');
    }
  };

  const analyzeAsset = async () => {
    if (!selectedImage?.base64) {
      Alert.alert('No Image', 'Please select an image before analyzing.');
      return;
    }

    setAnalyzing(true);

    try {
      // REAL AI ANALYSIS with Gemini Vision
      const diagnosis = await GeminiAIService.analyzeAssetImage(
        selectedImage.base64,
        {
          type: 'HVAC Unit',
          model: 'Industrial AC-2000',
          age: 5,
          lastInspection: '2024-01-15',
        }
      );

      setDiagnosisResult(diagnosis);
    } catch (error) {
      Alert.alert(
        'Analysis Failed',
        error instanceof Error ? error.message : 'Unable to analyze image. Please check your API key.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setDiagnosisResult(null);
  };

  const getSeverityColor = (severity: DiagnosisIssue['severity']): string => {
    const colors = {
      critical: '#dc2626',
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981',
    };
    return colors[severity];
  };

  const getConditionColor = (condition: DiagnosisResult['overall_condition']): string => {
    const colors = {
      excellent: '#10b981',
      good: '#3b82f6',
      fair: '#f59e0b',
      poor: '#ef4444',
      critical: '#dc2626',
    };
    return colors[condition];
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.header}>
          <Text style={styles.headerTitle}>🔬 AI Asset Doctor</Text>
          <Text style={styles.headerSubtitle}>
            Advanced visual diagnosis powered by Gemini AI
          </Text>
        </LinearGradient>

        {/* Image Selection */}
        <View style={styles.section}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.image} resizeMode="cover" />
              <TouchableOpacity style={styles.removeButton} onPress={resetAnalysis}>
                <Text style={styles.removeButtonText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderIcon}>📸</Text>
              <Text style={styles.placeholderTitle}>No Asset Image</Text>
              <Text style={styles.placeholderSubtitle}>Capture or select an image to begin analysis</Text>
            </View>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.cameraButton]} onPress={selectImageFromCamera}>
              <Text style={styles.actionIcon}>📷</Text>
              <Text style={styles.actionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.galleryButton]} onPress={selectImageFromLibrary}>
              <Text style={styles.actionIcon}>🖼️</Text>
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <TouchableOpacity
              style={[styles.analyzeButton, analyzing && styles.analyzeButtonDisabled]}
              onPress={analyzeAsset}
              disabled={analyzing}
            >
              <LinearGradient
                colors={analyzing ? ['#9ca3af', '#6b7280'] : ['#10b981', '#059669']}
                style={styles.analyzeGradient}
              >
                {analyzing ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.analyzeText}>Analyzing with Gemini AI...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.analyzeIcon}>🤖</Text>
                    <Text style={styles.analyzeText}>Analyze with AI</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Diagnosis Results */}
        {diagnosisResult && (
          <>
            {/* Overall Condition */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Condition</Text>
              <View style={styles.conditionCard}>
                <View style={styles.conditionHeader}>
                  <Text style={[styles.conditionStatus, { color: getConditionColor(diagnosisResult.overall_condition) }]}>
                    {diagnosisResult.overall_condition.toUpperCase()}
                  </Text>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{diagnosisResult.confidence}% Confidence</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${diagnosisResult.confidence}%`,
                        backgroundColor: getConditionColor(diagnosisResult.overall_condition),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.analysisTime}>
                  ⚡ Analysis completed in {diagnosisResult.analysis_duration.toFixed(1)}s
                </Text>
              </View>
            </View>

            {/* Issues */}
            {diagnosisResult.issues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detected Issues ({diagnosisResult.issues.length})</Text>
                {diagnosisResult.issues.map((issue, index) => (
                  <View key={index} style={[styles.issueCard, { borderLeftColor: getSeverityColor(issue.severity) }]}>
                    <View style={styles.issueHeader}>
                      <Text style={styles.issueType}>{issue.type}</Text>
                      <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(issue.severity) }]}>
                        <Text style={styles.severityText}>{issue.severity.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.issueLocation}>📍 {issue.location}</Text>
                    <Text style={styles.issueDescription}>{issue.description}</Text>
                    <View style={styles.recommendationBox}>
                      <Text style={styles.recommendationLabel}>💡 Recommendation</Text>
                      <Text style={styles.recommendationText}>{issue.recommendation}</Text>
                    </View>
                    <Text style={styles.issueConfidence}>AI Confidence: {Math.round(issue.confidence * 100)}%</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendations */}
            {diagnosisResult.recommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Recommendations</Text>
                <View style={styles.recommendationsCard}>
                  {diagnosisResult.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Text style={styles.bullet}>✓</Text>
                      <Text style={styles.recommendationItemText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Cost & Urgency */}
            <View style={styles.section}>
              <View style={styles.metricRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Estimated Cost</Text>
                  <Text style={styles.metricValue}>${diagnosisResult.estimated_cost.toLocaleString()}</Text>
                </View>
                <View style={[styles.metricCard, styles.urgencyCard]}>
                  <Text style={styles.metricLabel}>Urgency</Text>
                  <Text style={[styles.metricValue, { color: getSeverityColor(diagnosisResult.urgency === 'immediate' ? 'critical' : diagnosisResult.urgency as any) }]}>
                    {diagnosisResult.urgency.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.section}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>📋 Create Work Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={resetAnalysis}>
                <Text style={styles.secondaryButtonText}>🔄 Analyze Another Asset</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#e5e7eb',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  placeholderContainer: {
    height: 240,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  placeholderTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 6,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  cameraButton: {
    backgroundColor: '#3b82f6',
  },
  galleryButton: {
    backgroundColor: '#8b5cf6',
  },
  actionIcon: {
    fontSize: 22,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  analyzeIcon: {
    fontSize: 24,
  },
  analyzeText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  conditionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  conditionStatus: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  confidenceBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  analysisTime: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  issueCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  issueType: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  severityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  issueLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  issueDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    marginBottom: 14,
  },
  recommendationBox: {
    backgroundColor: '#ecfdf5',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6ee7b7',
    marginBottom: 10,
  },
  recommendationLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 19,
  },
  issueConfidence: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  recommendationsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 14,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 18,
    color: '#10b981',
    marginRight: 12,
    marginTop: 1,
  },
  recommendationItemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  urgencyCard: {
    borderWidth: 2,
    borderColor: '#fef3c7',
  },
  metricLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SmartAssetDoctorScreen;