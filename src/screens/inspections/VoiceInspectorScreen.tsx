import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VoiceRecognitionService } from '../services/VoiceRecognitionService';
import { AIInspectionService } from '../services/AIInspectionService';

interface InspectionData {
  assetId: string;
  assetName: string;
  issues: string[];
  temperature?: number;
  vibration?: string;
  visualIssues?: string[];
  recommendation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: number;
}

const VoiceInspectorScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<InspectionData | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscript('');
      await VoiceRecognitionService.startRecording((text) => {
        setTranscript((prev) => prev + ' ' + text);
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await VoiceRecognitionService.stopRecording();
      
      if (transcript) {
        processInspection();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const processInspection = async () => {
    setIsProcessing(true);
    try {
      // Process voice transcript with AI
      const result = await AIInspectionService.processVoiceInspection(transcript);
      setInspectionResult(result);
      
      // Automatically create work order if critical
      if (result.priority === 'critical') {
        Alert.alert(
          'Critical Issue Detected',
          'A work order has been automatically created and assigned.',
          [{ text: 'View Work Order', onPress: () => navigation.navigate('WorkOrders') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process inspection');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const exampleCommands = [
    '🎤 "Pump A-145 has abnormal vibration and temperature 15°C above normal"',
    '🎤 "Motor B-092 making unusual noise, check bearings immediately"',
    '🎤 "Compressor C-234 pressure drop detected, possible leak"',
    '🎤 "Generator D-456 showing oil contamination, schedule maintenance"',
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.header}>
        <Text style={styles.headerTitle}>🎤 Voice AI Inspector</Text>
        <Text style={styles.headerSubtitle}>
          Speak your inspection, AI does the rest
        </Text>
      </LinearGradient>

      {/* Voice Recording Section */}
      <View style={styles.section}>
        <View style={styles.recordingContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.micButton,
                isRecording && styles.micButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isRecording ? ['#ef4444', '#dc2626'] : ['#3b82f6', '#2563eb']}
                style={styles.micGradient}
              >
                <Text style={styles.micIcon}>
                  {isRecording ? '⏸️' : '🎤'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.recordingStatus}>
            {isRecording
              ? '🔴 Recording... Tap to stop'
              : isProcessing
              ? '⚙️ Processing...'
              : '🎙️ Tap to start inspection'}
          </Text>
        </View>

        {/* Live Transcript */}
        {transcript && (
          <View style={styles.transcriptCard}>
            <Text style={styles.transcriptTitle}>📝 Transcript</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}
      </View>

      {/* Example Commands */}
      {!inspectionResult && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Example Commands</Text>
          {exampleCommands.map((command, index) => (
            <View key={index} style={styles.exampleCard}>
              <Text style={styles.exampleText}>{command}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Inspection Results */}
      {inspectionResult && (
        <>
          {/* Asset Info */}
          <View style={styles.section}>
            <LinearGradient
              colors={['#f1f5f9', '#e2e8f0']}
              style={styles.assetCard}
            >
              <Text style={styles.assetLabel}>ASSET IDENTIFIED</Text>
              <Text style={styles.assetName}>{inspectionResult.assetName}</Text>
              <Text style={styles.assetId}>ID: {inspectionResult.assetId}</Text>
            </LinearGradient>
          </View>

          {/* Priority Badge */}
          <View style={styles.section}>
            <LinearGradient
              colors={getPriorityColor(inspectionResult.priority)}
              style={styles.priorityCard}
            >
              <Text style={styles.priorityLabel}>PRIORITY LEVEL</Text>
              <Text style={styles.priorityValue}>
                {inspectionResult.priority.toUpperCase()}
              </Text>
            </LinearGradient>
          </View>

          {/* Issues Detected */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Issues Detected</Text>
            {inspectionResult.issues.map((issue, index) => (
              <View key={index} style={styles.issueCard}>
                <Text style={styles.issueBullet}>•</Text>
                <Text style={styles.issueText}>{issue}</Text>
              </View>
            ))}
          </View>

          {/* Technical Data */}
          {(inspectionResult.temperature || inspectionResult.vibration) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Technical Readings</Text>
              <View style={styles.dataGrid}>
                {inspectionResult.temperature && (
                  <View style={styles.dataCard}>
                    <Text style={styles.dataIcon}>🌡️</Text>
                    <Text style={styles.dataValue}>
                      {inspectionResult.temperature}°C
                    </Text>
                    <Text style={styles.dataLabel}>Temperature</Text>
                  </View>
                )}
                {inspectionResult.vibration && (
                  <View style={styles.dataCard}>
                    <Text style={styles.dataIcon}>📳</Text>
                    <Text style={styles.dataValue}>
                      {inspectionResult.vibration}
                    </Text>
                    <Text style={styles.dataLabel}>Vibration</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* AI Recommendation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Recommendation</Text>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationText}>
                {inspectionResult.recommendation}
              </Text>
              <View style={styles.costContainer}>
                <Text style={styles.costLabel}>Estimated Cost:</Text>
                <Text style={styles.costValue}>
                  ${inspectionResult.estimatedCost.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions Taken */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Actions Automatically Taken</Text>
            <View style={styles.actionsList}>
              <View style={styles.actionItem}>
                <Text style={styles.actionIcon}>✓</Text>
                <Text style={styles.actionText}>Inspection logged</Text>
              </View>
              <View style={styles.actionItem}>
                <Text style={styles.actionIcon}>✓</Text>
                <Text style={styles.actionText}>Work order created</Text>
              </View>
              <View style={styles.actionItem}>
                <Text style={styles.actionIcon}>✓</Text>
                <Text style={styles.actionText}>
                  Technician assigned based on expertise
                </Text>
              </View>
              <View style={styles.actionItem}>
                <Text style={styles.actionIcon}>✓</Text>
                <Text style={styles.actionText}>Parts ordered from supplier</Text>
              </View>
              <View style={styles.actionItem}>
                <Text style={styles.actionIcon}>✓</Text>
                <Text style={styles.actionText}>Supervisor notified</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('WorkOrders')}
            >
              <Text style={styles.viewButtonText}>📋 View Work Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newInspectionButton}
              onPress={() => {
                setTranscript('');
                setInspectionResult(null);
              }}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.newInspectionGradient}
              >
                <Text style={styles.newInspectionText}>
                  🎤 New Inspection
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    color: '#bfdbfe',
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
  recordingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  micButtonActive: {
    shadowColor: '#ef4444',
  },
  micGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 48,
  },
  recordingStatus: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  transcriptCard: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transcriptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
  },
  transcriptText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 24,
  },
  exampleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  assetCard: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  assetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  assetName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  assetId: {
    fontSize: 14,
    color: '#64748b',
  },
  priorityCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  priorityLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
  },
  priorityValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  issueCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  issueBullet: {
    fontSize: 20,
    color: '#ef4444',
    marginRight: 12,
  },
  issueText: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 22,
  },
  dataGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  dataCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dataIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  dataLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 24,
    marginBottom: 16,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  costLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  costValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
  },
  actionsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionIcon: {
    fontSize: 20,
    color: '#10b981',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  viewButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  viewButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
  },
  newInspectionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  newInspectionGradient: {
    padding: 16,
    alignItems: 'center',
  },
  newInspectionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default VoiceInspectorScreen;
