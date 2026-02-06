import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const VoiceInspectorScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  const [inspectionData, setInspectionData] = useState({
    observations: [],
    measurements: [],
    issues: [],
    photos: [],
  });

  useEffect(() => {
    // Welcome message
    setConversation([
      {
        id: 1,
        type: 'ai',
        text: 'Hello! I\'m your AI Voice Inspector. I can help you conduct hands-free inspections. Which asset would you like to inspect?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const quickActions = [
    { id: 1, label: 'Start Inspection', icon: '🎯' },
    { id: 2, label: 'Add Observation', icon: '👁️' },
    { id: 3, label: 'Record Measurement', icon: '📏' },
    { id: 4, label: 'Report Issue', icon: '⚠️' },
    { id: 5, label: 'Take Photo', icon: '📸' },
    { id: 6, label: 'Complete Inspection', icon: '✅' },
  ];

  const exampleAssets = [
    { id: 1, name: 'PUMP-A-142', location: 'Building A' },
    { id: 2, name: 'MOTOR-B-456', location: 'Building B' },
    { id: 3, name: 'COMP-C-789', location: 'Building C' },
  ];

  const aiResponses = {
    start_inspection: [
      "Great! Starting inspection for {asset}. What's the first thing you notice?",
      "Inspection started for {asset} at {location}. Please describe the overall condition.",
    ],
    observation: [
      "Noted: {observation}. Anything else you'd like to add?",
      "I've recorded that observation. Would you like to take a photo to document it?",
      "Got it. Is this observation normal or concerning?",
    ],
    measurement: [
      "Measurement recorded: {measurement}. Is this within acceptable range?",
      "I've logged that measurement. Would you like me to compare it with the baseline?",
    ],
    issue: [
      "Issue recorded: {issue}. What's the severity level - Low, Medium, or High?",
      "I've documented that issue. Should I flag this for immediate attention?",
    ],
    complete: [
      "Inspection complete! I've found {observations} observations, {measurements} measurements, and {issues} issues. Would you like me to generate the report?",
    ],
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate starting voice recognition
      addMessage('ai', 'Listening... Please speak clearly.');
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        simulateVoiceInput();
      }, 3000);
    } else {
      addMessage('ai', 'Stopped listening.');
    }
  };

  const simulateVoiceInput = () => {
    const sampleInputs = [
      "The pump is making unusual vibration sounds",
      "Temperature reading is 75 degrees Celsius",
      "I see rust on the mounting bolts",
      "Oil level is below minimum",
      "Everything looks normal",
    ];
    
    const randomInput = sampleInputs[Math.floor(Math.random() * sampleInputs.length)];
    addMessage('user', randomInput);
    setIsListening(false);
    
    // Process the input
    processInput(randomInput);
  };

  const processInput = (text) => {
    const lowerText = text.toLowerCase();
    
    // Detect intent
    if (lowerText.includes('start') || lowerText.includes('inspect')) {
      if (exampleAssets.length > 0) {
        setCurrentAsset(exampleAssets[0]);
        addMessage('ai', aiResponses.start_inspection[0].replace('{asset}', exampleAssets[0].name).replace('{location}', exampleAssets[0].location));
      }
    } else if (lowerText.includes('temperature') || lowerText.includes('degrees') || lowerText.includes('reading')) {
      const measurement = { type: 'temperature', value: text, timestamp: new Date() };
      setInspectionData(prev => ({
        ...prev,
        measurements: [...prev.measurements, measurement],
      }));
      addMessage('ai', aiResponses.measurement[0].replace('{measurement}', text));
    } else if (lowerText.includes('rust') || lowerText.includes('leak') || lowerText.includes('crack') || lowerText.includes('damage') || lowerText.includes('worn')) {
      const issue = { description: text, severity: 'medium', timestamp: new Date() };
      setInspectionData(prev => ({
        ...prev,
        issues: [...prev.issues, issue],
      }));
      addMessage('ai', aiResponses.issue[0].replace('{issue}', text));
    } else if (lowerText.includes('complete') || lowerText.includes('finish') || lowerText.includes('done')) {
      const summary = aiResponses.complete[0]
        .replace('{observations}', inspectionData.observations.length)
        .replace('{measurements}', inspectionData.measurements.length)
        .replace('{issues}', inspectionData.issues.length);
      addMessage('ai', summary);
    } else {
      const observation = { description: text, timestamp: new Date() };
      setInspectionData(prev => ({
        ...prev,
        observations: [...prev.observations, observation],
      }));
      addMessage('ai', aiResponses.observation[Math.floor(Math.random() * aiResponses.observation.length)].replace('{observation}', text));
    }
  };

  const addMessage = (type, text) => {
    const newMessage = {
      id: conversation.length + 1,
      type,
      text,
      timestamp: new Date(),
    };
    setConversation(prev => [...prev, newMessage]);
  };

  const handleQuickAction = (action) => {
    switch (action.label) {
      case 'Start Inspection':
        Alert.alert(
          'Select Asset',
          'Which asset would you like to inspect?',
          exampleAssets.map(asset => ({
            text: `${asset.name} - ${asset.location}`,
            onPress: () => {
              setCurrentAsset(asset);
              addMessage('user', `Start inspection for ${asset.name}`);
              addMessage('ai', `Starting inspection for ${asset.name} at ${asset.location}. Please describe what you see.`);
            },
          }))
        );
        break;
      case 'Add Observation':
        addMessage('user', 'I want to add an observation');
        addMessage('ai', 'Sure! Please describe what you observed.');
        break;
      case 'Record Measurement':
        addMessage('user', 'I want to record a measurement');
        addMessage('ai', 'What measurement would you like to record? Please include the value and unit.');
        break;
      case 'Report Issue':
        addMessage('user', 'I want to report an issue');
        addMessage('ai', 'Please describe the issue you found. I\'ll help you document it.');
        break;
      case 'Take Photo':
        addMessage('user', 'I want to take a photo');
        addMessage('ai', 'Great! In a production app, the camera would open now. Photo added to inspection.');
        setInspectionData(prev => ({
          ...prev,
          photos: [...prev.photos, { timestamp: new Date() }],
        }));
        break;
      case 'Complete Inspection':
        const summary = `Inspection complete! Summary:\n• ${inspectionData.observations.length} observations\n• ${inspectionData.measurements.length} measurements\n• ${inspectionData.issues.length} issues\n• ${inspectionData.photos.length} photos\n\nWould you like me to generate the full report?`;
        addMessage('user', 'Complete inspection');
        addMessage('ai', summary);
        break;
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage('user', inputText);
      processInput(inputText);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1e3a5f', '#2c5282']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Voice Inspector</Text>
          <Text style={styles.headerSubtitle}>AI-Powered Hands-Free Inspections</Text>
        </View>
        {currentAsset && (
          <View style={styles.currentAssetBadge}>
            <Text style={styles.currentAssetText}>
              🎯 {currentAsset.name}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Quick Actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickActionsScroll}
        contentContainerStyle={styles.quickActionsContent}
      >
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionButton}
            onPress={() => handleQuickAction(action)}
          >
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conversation */}
      <ScrollView
        style={styles.conversationContainer}
        contentContainerStyle={styles.conversationContent}
        showsVerticalScrollIndicator={false}
        ref={(ref) => {
          if (ref) {
            ref.scrollToEnd({ animated: true });
          }
        }}
      >
        {conversation.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            {message.type === 'ai' && (
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>🤖</Text>
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                message.type === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.type === 'user' ? styles.userText : styles.aiText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  message.type === 'user' ? styles.userTime : styles.aiTime,
                ]}
              >
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            {message.type === 'user' && (
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>👤</Text>
              </View>
            )}
          </View>
        ))}

        {isListening && (
          <View style={styles.listeningIndicator}>
            <View style={styles.listeningDot} />
            <Text style={styles.listeningText}>Listening...</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={handleVoiceToggle}
        >
          <View style={styles.voiceButtonContent}>
            <Text style={styles.voiceButtonIcon}>
              {isListening ? '⏸️' : '🎤'}
            </Text>
            <Text style={styles.voiceButtonText}>
              {isListening ? 'Stop Listening' : 'Tap to Speak'}
            </Text>
          </View>
          {isListening && (
            <View style={styles.waveformContainer}>
              <View style={[styles.waveBar, { height: 12 }]} />
              <View style={[styles.waveBar, { height: 20 }]} />
              <View style={[styles.waveBar, { height: 16 }]} />
              <View style={[styles.waveBar, { height: 24 }]} />
              <View style={[styles.waveBar, { height: 18 }]} />
              <View style={[styles.waveBar, { height: 22 }]} />
              <View style={[styles.waveBar, { height: 14 }]} />
            </View>
          )}
        </TouchableOpacity>

        {/* Inspection Stats */}
        {(inspectionData.observations.length > 0 ||
          inspectionData.measurements.length > 0 ||
          inspectionData.issues.length > 0) && (
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{inspectionData.observations.length}</Text>
              <Text style={styles.statLabel}>Observations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{inspectionData.measurements.length}</Text>
              <Text style={styles.statLabel}>Measurements</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{inspectionData.issues.length}</Text>
              <Text style={styles.statLabel}>Issues</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{inspectionData.photos.length}</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerContent: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94c5f8',
  },
  currentAssetBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  currentAssetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  quickActionsScroll: {
    maxHeight: 100,
  },
  quickActionsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  quickActionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  conversationContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  conversationContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiAvatarText: {
    fontSize: 18,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  userAvatarText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 12,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  aiText: {
    color: '#1e293b',
  },
  userText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
  },
  aiTime: {
    color: '#94a3b8',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  listeningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  listeningText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 15,
    color: '#1e293b',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
  },
  voiceButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  voiceButtonActive: {
    backgroundColor: '#ef4444',
  },
  voiceButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  waveformContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 12,
    height: 30,
    gap: 4,
  },
  waveBar: {
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
  },
});

export default VoiceInspectorScreen;
