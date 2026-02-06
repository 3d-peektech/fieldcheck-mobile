import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const AIAnalysis = ({ navigation }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleStartAnalysis = () => {
    Alert.alert(
      'Start AI Analysis',
      'Choose an option to begin analysis:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: () => openCamera(),
        },
        {
          text: 'Upload Image',
          onPress: () => pickImage(),
        },
      ]
    );
  };

  const openCamera = async () => {
    try {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        performAIAnalysis(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Photo library permission is required');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        performAIAnalysis(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const performAIAnalysis = async (imageUri) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real app, you would:
      // 1. Upload image to your AI server
      // 2. Process with TensorFlow/ML model
      // 3. Get real analysis results
      
      // Simulated AI analysis result
      const analysisData = {
        defectDetected: Math.random() > 0.3, // 70% chance of defect
        defectType: getRandomDefectType(),
        severity: getRandomSeverity(),
        confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
        location: getRandomLocation(),
        recommendation: '',
        estimatedCost: Math.floor(Math.random() * 5000) + 500,
        urgency: '',
      };

      // Set recommendation based on severity
      if (analysisData.severity === 'Critical') {
        analysisData.recommendation = 'Immediate action required. Schedule emergency maintenance.';
        analysisData.urgency = 'URGENT - 24 hours';
      } else if (analysisData.severity === 'Major') {
        analysisData.recommendation = 'Schedule maintenance within 7 days to prevent further damage.';
        analysisData.urgency = 'High - Within 1 week';
      } else if (analysisData.severity === 'Minor') {
        analysisData.recommendation = 'Include in next scheduled maintenance cycle.';
        analysisData.urgency = 'Medium - Within 30 days';
      } else {
        analysisData.recommendation = 'No immediate action required. Continue monitoring.';
        analysisData.urgency = 'Low - Monitor';
      }

      setAnalysisResult(analysisData);
      setIsAnalyzing(false);

      // Show completion alert
      Alert.alert(
        'Analysis Complete',
        `${analysisData.defectDetected ? 'Defect detected!' : 'No defects detected'}\nConfidence: ${analysisData.confidence}%`,
        [{ text: 'View Results' }]
      );

    } catch (error) {
      console.error('Error during analysis:', error);
      setIsAnalyzing(false);
      Alert.alert('Error', 'Analysis failed. Please try again.');
    }
  };

  const getRandomDefectType = () => {
    const types = ['Crack', 'Corrosion', 'Wear', 'Misalignment', 'Leak', 'Deformation'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getRandomSeverity = () => {
    const severities = ['Minor', 'Minor', 'Major', 'Critical']; // Weighted
    return severities[Math.floor(Math.random() * severities.length)];
  };

  const getRandomLocation = () => {
    const locations = [
      'Upper right corner',
      'Lower left section',
      'Center area',
      'Top edge',
      'Bottom surface',
      'Side panel'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return '#e74c3c';
      case 'Major': return '#e67e22';
      case 'Minor': return '#f39c12';
      default: return '#27ae60';
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const handleLearnMore = () => {
    Alert.alert(
      'About AI Analysis',
      'Our AI-powered analysis uses advanced computer vision to:\n\n' +
      '• Detect defects and anomalies\n' +
      '• Assess asset condition\n' +
      '• Predict maintenance needs\n' +
      '• Generate detailed reports\n\n' +
      'The system uses deep learning models trained on thousands of asset images to provide accurate, real-time analysis.',
      [{ text: 'Got it!' }]
    );
  };

  // If showing analysis results
  if (analysisResult && selectedImage) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultContainer}>
          {/* Analyzed Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.analyzedImage} />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageLabel}>Analyzed Image</Text>
            </View>
          </View>

          {/* Analysis Results */}
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Analysis Results</Text>
            
            {/* Status */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: analysisResult.defectDetected ? '#e74c3c' : '#27ae60' }
              ]}>
                <Text style={styles.statusText}>
                  {analysisResult.defectDetected ? '⚠️ Defect Detected' : '✅ No Defects'}
                </Text>
              </View>
            </View>

            {analysisResult.defectDetected && (
              <>
                {/* Defect Details */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>{analysisResult.defectType}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Severity:</Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(analysisResult.severity) }
                  ]}>
                    <Text style={styles.severityText}>{analysisResult.severity}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{analysisResult.location}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Confidence:</Text>
                  <View style={styles.confidenceContainer}>
                    <View style={styles.confidenceBar}>
                      <View 
                        style={[
                          styles.confidenceFill,
                          { width: `${analysisResult.confidence}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.confidenceText}>{analysisResult.confidence}%</Text>
                  </View>
                </View>

                {/* Recommendation */}
                <View style={styles.recommendationCard}>
                  <Text style={styles.recommendationTitle}>📋 Recommendation</Text>
                  <Text style={styles.recommendationText}>{analysisResult.recommendation}</Text>
                  <View style={styles.urgencyRow}>
                    <Text style={styles.urgencyLabel}>Urgency:</Text>
                    <Text style={styles.urgencyValue}>{analysisResult.urgency}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Estimated Cost:</Text>
                    <Text style={styles.costValue}>${analysisResult.estimatedCost}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.saveReportButton}
            onPress={() => Alert.alert('Success', 'Report saved successfully!')}
          >
            <Text style={styles.saveReportText}>💾 Save Report</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.newAnalysisButton}
            onPress={resetAnalysis}
          >
            <Text style={styles.newAnalysisText}>🔄 New Analysis</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    );
  }

  // Default screen (no analysis yet)
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Steps Section */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Capture Image</Text>
              <Text style={styles.stepDescription}>
                Take a clear photo of the asset or defect
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>AI Processing</Text>
              <Text style={styles.stepDescription}>
                Our AI analyzes the image in seconds
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Results</Text>
              <Text style={styles.stepDescription}>
                Receive detailed analysis and recommendations
              </Text>
            </View>
          </View>
        </View>

        {/* Capabilities Section */}
        <View style={styles.capabilitiesContainer}>
          <Text style={styles.sectionTitle}>Capabilities</Text>
          
          <View style={styles.capabilityCard}>
            <Text style={styles.capabilityIcon}>🔍</Text>
            <Text style={styles.capabilityText}>Defect Detection</Text>
          </View>

          <View style={styles.capabilityCard}>
            <Text style={styles.capabilityIcon}>📊</Text>
            <Text style={styles.capabilityText}>Condition Assessment</Text>
          </View>

          <View style={styles.capabilityCard}>
            <Text style={styles.capabilityIcon}>⚠️</Text>
            <Text style={styles.capabilityText}>Risk Prediction</Text>
          </View>

          <View style={styles.capabilityCard}>
            <Text style={styles.capabilityIcon}>📝</Text>
            <Text style={styles.capabilityText}>Auto-Report Generation</Text>
          </View>
        </View>

        {/* Loading State */}
        {isAnalyzing ? (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color="#9b59b6" />
            <Text style={styles.analyzingText}>Analyzing image...</Text>
            <Text style={styles.analyzingSubtext}>Please wait while AI processes your image</Text>
          </View>
        ) : (
          <>
            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartAnalysis}
            >
              <Text style={styles.startButtonText}>📸 Start Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.learnButton}
              onPress={handleLearnMore}
            >
              <Text style={styles.learnButtonText}>Learn More</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Tip Section */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Tip: For best results, ensure good lighting and clear images
          </Text>
        </View>
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
  },
  stepsContainer: {
    marginBottom: 30,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
  },
  capabilitiesContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  capabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  capabilityIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  capabilityText: {
    fontSize: 16,
    color: '#333',
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  analyzingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#9b59b6',
    fontWeight: '600',
  },
  analyzingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#9b59b6',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  learnButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#9b59b6',
  },
  learnButtonText: {
    color: '#9b59b6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff9e6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  
  // Results Screen Styles
  resultContainer: {
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  analyzedImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
  },
  imageLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  severityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    width: 50,
  },
  recommendationCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  urgencyRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  urgencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 5,
  },
  urgencyValue: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  costRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 5,
  },
  costValue: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  saveReportButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveReportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newAnalysisButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9b59b6',
    marginBottom: 20,
  },
  newAnalysisText: {
    color: '#9b59b6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AIAnalysis;
