// VoiceInspectorScreen.tsx
// Voice Inspector with Real Gemini AI Analysis
// Location: src/screens/ai/VoiceInspectorScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GeminiAIService, { VoiceAnalysisResult } from '../../services/GeminiAIService';

export default function VoiceInspectorScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [analysis, setAnalysis] = useState<VoiceAnalysisResult | null>(null);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const requestPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      return permission.status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Microphone access is required for voice inspection.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      setAnalysis(null);
      setTranscription('');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // Simular transcripción (en producción usarías un servicio de speech-to-text)
        simulateTranscription();
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const simulateTranscription = () => {
    // En producción, aquí llamarías a un servicio de speech-to-text
    // Por ahora, simulamos con texto de ejemplo
    const exampleTranscription = `Inspecting motor bearing assembly unit B-42. 
    Visual inspection shows signs of excessive wear on the outer race. 
    Bearing temperature reading is 85 degrees Celsius, which is above normal operating range. 
    Unusual vibration detected at 2.5mm/s RMS. 
    Oil analysis shows metal particles present. 
    Recommend immediate bearing replacement and full motor inspection. 
    Safety concern: high temperature may lead to bearing failure within 48-72 hours.`;
    
    setTranscription(exampleTranscription);
    analyzeWithGemini(exampleTranscription);
  };

  const analyzeWithGemini = async (text: string) => {
    if (!GeminiAIService.isConfigured()) {
      Alert.alert(
        'API Key Required',
        'Please configure your Gemini API key in GeminiAIService.ts',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Use Demo Mode', onPress: () => useDemoAnalysis(text) }
        ]
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await GeminiAIService.analyzeVoiceInspection(text);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        'Failed to analyze voice inspection. Using demo mode instead.',
        [{ text: 'OK', onPress: () => useDemoAnalysis(text) }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const useDemoAnalysis = (text: string) => {
    // Análisis demo cuando no hay API key
    const demoResult: VoiceAnalysisResult = {
      transcription: text,
      summary: 'Motor bearing B-42 showing critical wear and high temperature. Immediate action required.',
      detectedIssues: [
        'Excessive wear on bearing outer race',
        'Temperature 85°C (above normal)',
        'Vibration 2.5mm/s RMS (high)',
        'Metal particles in oil'
      ],
      recommendations: [
        'Replace bearing assembly immediately',
        'Conduct full motor inspection',
        'Schedule preventive maintenance',
        'Monitor temperature continuously'
      ],
      urgency: 'high',
      confidence: 85
    };
    
    setAnalysis(demoResult);
    setIsAnalyzing(false);
  };

  const analyzeManualInput = () => {
    if (!transcription.trim()) {
      Alert.alert('Empty Input', 'Please enter inspection notes to analyze.');
      return;
    }
    analyzeWithGemini(transcription);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
        <Text style={styles.headerTitle}>🎤 Voice Inspector</Text>
        <Text style={styles.headerSubtitle}>
          AI-Powered Voice Analysis
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, !manualMode && styles.modeButtonActive]}
            onPress={() => setManualMode(false)}
          >
            <Ionicons 
              name="mic" 
              size={20} 
              color={!manualMode ? '#FFFFFF' : '#8B5CF6'} 
            />
            <Text style={[styles.modeButtonText, !manualMode && styles.modeButtonTextActive]}>
              Voice
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, manualMode && styles.modeButtonActive]}
            onPress={() => setManualMode(true)}
          >
            <Ionicons 
              name="create" 
              size={20} 
              color={manualMode ? '#FFFFFF' : '#8B5CF6'} 
            />
            <Text style={[styles.modeButtonText, manualMode && styles.modeButtonTextActive]}>
              Manual
            </Text>
          </TouchableOpacity>
        </View>

        {!manualMode ? (
          /* Voice Recording Mode */
          <View style={styles.recordingContainer}>
            <View style={styles.recordingVisual}>
              <View style={[
                styles.recordingCircle,
                isRecording && styles.recordingCircleActive
              ]}>
                <Ionicons 
                  name={isRecording ? "stop" : "mic"} 
                  size={48} 
                  color="#FFFFFF" 
                />
              </View>
              {isRecording && (
                <View style={styles.pulseContainer}>
                  <View style={[styles.pulse, styles.pulse1]} />
                  <View style={[styles.pulse, styles.pulse2]} />
                  <View style={[styles.pulse, styles.pulse3]} />
                </View>
              )}
            </View>

            <Text style={styles.recordingDuration}>
              {formatDuration(recordingDuration)}
            </Text>

            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordButtonActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.recordButtonText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.recordingHint}>
              {isRecording 
                ? 'Speak clearly about your inspection findings...' 
                : 'Tap to start voice inspection recording'}
            </Text>
          </View>
        ) : (
          /* Manual Input Mode */
          <View style={styles.manualContainer}>
            <Text style={styles.manualLabel}>Inspection Notes:</Text>
            <View style={styles.textInputContainer}>
              <ScrollView style={styles.textInputScroll}>
                <Text
                  style={styles.textInput}
                  onPress={() => {
                    // En producción, esto sería un TextInput editable
                    Alert.prompt(
                      'Enter Inspection Notes',
                      'Describe what you observed during the inspection:',
                      (text) => setTranscription(text),
                      'plain-text',
                      transcription
                    );
                  }}
                >
                  {transcription || 'Tap to enter inspection notes...'}
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzeManualInput}
              disabled={!transcription.trim()}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.analyzeButtonGradient}
              >
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Transcription */}
        {transcription && !manualMode ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Transcription</Text>
            <View style={styles.transcriptionBox}>
              <Text style={styles.transcriptionText}>{transcription}</Text>
            </View>
          </View>
        ) : null}

        {/* Analysis Loading */}
        {isAnalyzing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>
              Analyzing with Gemini AI...
            </Text>
          </View>
        ) : null}

        {/* AI Analysis Results */}
        {analysis && !isAnalyzing ? (
          <View style={styles.resultsContainer}>
            {/* Summary */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="document-text" size={24} color="#8B5CF6" />
                <Text style={styles.resultTitle}>Summary</Text>
              </View>
              <Text style={styles.resultText}>{analysis.summary}</Text>
            </View>

            {/* Detected Issues */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="warning" size={24} color="#F59E0B" />
                <Text style={styles.resultTitle}>Detected Issues</Text>
                <View style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyColor(analysis.urgency) }
                ]}>
                  <Text style={styles.urgencyText}>
                    {analysis.urgency.toUpperCase()}
                  </Text>
                </View>
              </View>
              {analysis.detectedIssues.map((issue, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{issue}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="bulb" size={24} color="#10B981" />
                <Text style={styles.resultTitle}>Recommendations</Text>
              </View>
              {analysis.recommendations.map((rec, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.listItemText}>{rec}</Text>
                </View>
              ))}
            </View>

            {/* Confidence Score */}
            <View style={styles.confidenceCard}>
              <Text style={styles.confidenceLabel}>AI Confidence</Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill,
                    { width: `${analysis.confidence}%` }
                  ]} 
                />
              </View>
              <Text style={styles.confidenceValue}>{analysis.confidence}%</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color="#8B5CF6" />
                <Text style={styles.actionButtonText}>Share Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={20} color="#8B5CF6" />
                <Text style={styles.actionButtonText}>Export PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
  },
  modeToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  recordingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  recordingVisual: {
    position: 'relative',
    marginBottom: 24,
  },
  recordingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingCircleActive: {
    backgroundColor: '#EF4444',
  },
  pulseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  pulse1: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  pulse2: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  pulse3: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  recordingDuration: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  recordButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recordingHint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  manualContainer: {
    padding: 20,
  },
  manualLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  textInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    maxHeight: 200,
  },
  textInputScroll: {
    padding: 16,
  },
  textInput: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  analyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  transcriptionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transcriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  resultsContainer: {
    padding: 20,
    gap: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginTop: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  confidenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});