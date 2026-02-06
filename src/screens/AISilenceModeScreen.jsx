import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AISilenceModeScreen = ({ navigation, route }) => {
  const { assetId, assetName, reason } = route.params || {
    assetId: 'PUMP-A-142',
    assetName: 'Hydraulic Pump A-142',
    reason: 'insufficient_data',
  };

  const silenceReasons = {
    insufficient_data: {
      title: 'Insufficient Historical Data',
      icon: '📊',
      color: ['#64748b', '#475569'],
      explanation: 'This asset doesn\'t have enough operational history for AI to make reliable predictions yet.',
      details: [
        'AI models require at least 30 days of sensor data',
        'Currently collected: 8 days',
        'Needed: 22 more days',
      ],
      recommendations: [
        {
          title: 'Continue Data Collection',
          description: 'Keep sensors active. AI will automatically enable when enough data is collected.',
          icon: '⏱️',
        },
        {
          title: 'Manual Monitoring',
          description: 'Rely on traditional inspection methods in the meantime.',
          icon: '👁️',
        },
        {
          title: 'Transfer Learning',
          description: 'Use AI insights from similar assets (available in 5 days).',
          icon: '🔄',
        },
      ],
      timeline: {
        current: 8,
        total: 30,
        eta: '22 days',
      },
    },
    sensor_malfunction: {
      title: 'Sensor Quality Issues Detected',
      icon: '⚠️',
      color: ['#f59e0b', '#d97706'],
      explanation: 'AI has detected inconsistent or unreliable sensor readings that could lead to false predictions.',
      details: [
        'Vibration sensor showing intermittent failures',
        'Last reliable reading: 2 days ago',
        'Data quality score: 34%',
      ],
      recommendations: [
        {
          title: 'Inspect Sensors',
          description: 'Check sensor connections and mounting points for issues.',
          icon: '🔧',
        },
        {
          title: 'Recalibrate',
          description: 'Sensors may need recalibration or replacement.',
          icon: '⚙️',
        },
        {
          title: 'Alternative Data Sources',
          description: 'Use temperature and acoustic sensors for partial AI analysis.',
          icon: '📡',
        },
      ],
      timeline: null,
    },
    new_asset: {
      title: 'New Asset - Baseline in Progress',
      icon: '🆕',
      color: ['#3b82f6', '#2563eb'],
      explanation: 'This asset was recently added. AI is establishing baseline performance patterns.',
      details: [
        'Asset registered: 3 days ago',
        'Baseline establishment: 7-14 days',
        'Current confidence: Too early',
      ],
      recommendations: [
        {
          title: 'Establish Baseline',
          description: 'Let the asset run under normal conditions for AI to learn normal behavior.',
          icon: '📈',
        },
        {
          title: 'Document Operation',
          description: 'Record operating conditions to help AI learn faster.',
          icon: '📝',
        },
        {
          title: 'Similar Asset Insights',
          description: 'View predictions from similar assets in your fleet.',
          icon: '🔗',
        },
      ],
      timeline: {
        current: 3,
        total: 14,
        eta: '11 days',
      },
    },
    anomaly_detected: {
      title: 'Unusual Behavior Detected',
      icon: '🤔',
      color: ['#8b5cf6', '#7c3aed'],
      explanation: 'Asset showing behavior outside AI training range. Predictions paused to prevent false alarms.',
      details: [
        'Operating parameters outside normal range',
        'AI needs to verify if this is the new normal',
        'Learning mode active',
      ],
      recommendations: [
        {
          title: 'Verify Operation',
          description: 'Confirm asset is operating as intended despite unusual readings.',
          icon: '✓',
        },
        {
          title: 'Update AI Parameters',
          description: 'If this is normal, AI will adapt within 3-5 days.',
          icon: '🔄',
        },
        {
          title: 'Investigate Anomaly',
          description: 'Check if unusual behavior indicates a problem.',
          icon: '🔍',
        },
      ],
      timeline: {
        current: 1,
        total: 5,
        eta: '4 days',
      },
    },
    maintenance_window: {
      title: 'Post-Maintenance Recalibration',
      icon: '🔧',
      color: ['#10b981', '#059669'],
      explanation: 'Recent maintenance changed asset characteristics. AI is recalibrating predictions.',
      details: [
        'Maintenance completed: Yesterday',
        'Recalibration period: 3-7 days',
        'New baseline needed',
      ],
      recommendations: [
        {
          title: 'Monitor Performance',
          description: 'Observe asset carefully during recalibration period.',
          icon: '👀',
        },
        {
          title: 'Verify Repairs',
          description: 'Ensure maintenance was successful and asset operates normally.',
          icon: '✅',
        },
        {
          title: 'Resume AI Soon',
          description: 'AI will resume full predictions within a week.',
          icon: '⏰',
        },
      ],
      timeline: {
        current: 1,
        total: 7,
        eta: '6 days',
      },
    },
  };

  const currentReason = silenceReasons[reason] || silenceReasons.insufficient_data;

  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={currentReason.color}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{currentReason.icon}</Text>
          <Text style={styles.headerTitle}>AI Silence Mode</Text>
          <Text style={styles.headerSubtitle}>
            Transparent AI - We tell you when we don't know
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Asset Info */}
        <View style={styles.assetCard}>
          <View style={styles.assetHeader}>
            <View>
              <Text style={styles.assetName}>{assetName}</Text>
              <Text style={styles.assetId}>{assetId}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>AI PAUSED</Text>
            </View>
          </View>
        </View>

        {/* Main Reason Card */}
        <View style={styles.reasonCard}>
          <View style={styles.reasonHeader}>
            <Text style={styles.reasonIcon}>{currentReason.icon}</Text>
            <Text style={styles.reasonTitle}>{currentReason.title}</Text>
          </View>
          <Text style={styles.reasonExplanation}>{currentReason.explanation}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 What's Happening</Text>
          <View style={styles.detailsCard}>
            {currentReason.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Timeline (if available) */}
        {currentReason.timeline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏱️ Progress Timeline</Text>
            <View style={styles.timelineCard}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineLabel}>
                  Day {currentReason.timeline.current} of {currentReason.timeline.total}
                </Text>
                <Text style={styles.timelineETA}>ETA: {currentReason.timeline.eta}</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(currentReason.timeline.current / currentReason.timeline.total) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round((currentReason.timeline.current / currentReason.timeline.total) * 100)}% Complete
              </Text>
            </View>
          </View>
        )}

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 What You Can Do</Text>
          {currentReason.recommendations.map((rec, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recommendationCard}
              onPress={() => toggleCard(index)}
            >
              <View style={styles.recHeader}>
                <View style={styles.recIconContainer}>
                  <Text style={styles.recIcon}>{rec.icon}</Text>
                </View>
                <View style={styles.recContent}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  {expandedCard === index && (
                    <Text style={styles.recDescription}>{rec.description}</Text>
                  )}
                </View>
                <Text style={styles.expandIcon}>
                  {expandedCard === index ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transparency Notice */}
        <View style={styles.transparencyCard}>
          <Text style={styles.transparencyTitle}>🤝 Our Commitment to Transparency</Text>
          <Text style={styles.transparencyText}>
            We believe AI should be honest about its limitations. When our models don't have enough confidence to make predictions, we pause them rather than risk giving you unreliable information.
          </Text>
          <View style={styles.transparencyStats}>
            <View style={styles.transparencyStat}>
              <Text style={styles.transparencyValue}>92%</Text>
              <Text style={styles.transparencyLabel}>Avg Confidence</Text>
            </View>
            <View style={styles.transparencyStat}>
              <Text style={styles.transparencyValue}>3.2%</Text>
              <Text style={styles.transparencyLabel}>False Alarm Rate</Text>
            </View>
          </View>
        </View>

        {/* Why This Matters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Why This Matters</Text>
          <View style={styles.whyCard}>
            <Text style={styles.whyText}>
              <Text style={styles.whyBold}>Trustworthy AI</Text> means being transparent about uncertainty. We'd rather tell you "we don't know yet" than give you a prediction we're not confident in.
            </Text>
            <Text style={styles.whyText}>
              This approach has helped us maintain a <Text style={styles.whyBold}>92% average confidence score</Text> and keep false alarms below <Text style={styles.whyBold}>3.2%</Text> across all predictions.
            </Text>
          </View>
        </View>

        {/* Alternative Data Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Alternative Insights Available</Text>
          <View style={styles.alternativeCard}>
            <Text style={styles.alternativeTitle}>While AI predictions are paused, you can still:</Text>
            <View style={styles.alternativeItem}>
              <Text style={styles.alternativeIcon}>📅</Text>
              <Text style={styles.alternativeText}>View scheduled maintenance reminders</Text>
            </View>
            <View style={styles.alternativeItem}>
              <Text style={styles.alternativeIcon}>📈</Text>
              <Text style={styles.alternativeText}>Check manual inspection history</Text>
            </View>
            <View style={styles.alternativeItem}>
              <Text style={styles.alternativeIcon}>🔔</Text>
              <Text style={styles.alternativeText}>Set up threshold-based alerts</Text>
            </View>
            <View style={styles.alternativeItem}>
              <Text style={styles.alternativeIcon}>👥</Text>
              <Text style={styles.alternativeText}>See insights from similar assets</Text>
            </View>
          </View>
        </View>

        {/* Contact Support */}
        <TouchableOpacity style={styles.supportButton}>
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            style={styles.supportButtonGradient}
          >
            <Text style={styles.supportButtonText}>💬 Questions? Contact AI Team</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  assetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  assetId: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#854d0e',
  },
  reasonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reasonIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  reasonTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  reasonExplanation: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailBullet: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
    fontWeight: '700',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  timelineETA: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recIcon: {
    fontSize: 20,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  recDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginTop: 4,
  },
  expandIcon: {
    fontSize: 24,
    color: '#94a3b8',
    marginLeft: 8,
  },
  transparencyCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  transparencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 12,
  },
  transparencyText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 22,
    marginBottom: 16,
  },
  transparencyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transparencyStat: {
    alignItems: 'center',
  },
  transparencyValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  transparencyLabel: {
    fontSize: 12,
    color: '#1e40af',
  },
  whyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  whyText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 12,
  },
  whyBold: {
    fontWeight: '700',
    color: '#1e293b',
  },
  alternativeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alternativeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
  supportButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  supportButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default AISilenceModeScreen;
