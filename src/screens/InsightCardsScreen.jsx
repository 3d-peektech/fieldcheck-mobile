import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;

const InsightCardsScreen = ({ navigation }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // all, cost, efficiency, risk, maintenance

  const insights = [
    {
      id: 1,
      category: 'cost',
      title: 'Optimize Preventive Maintenance Schedule',
      subtitle: 'Reduce costs by 23% with AI-optimized timing',
      impact: '$34,500',
      impactLabel: 'Annual Savings',
      confidence: 91,
      urgency: 'high',
      timeframe: '30 days to implement',
      icon: '💰',
      color: ['#10b981', '#059669'],
      summary: 'AI analysis suggests shifting from fixed-interval to condition-based maintenance for 12 critical assets.',
      benefits: [
        'Reduce unnecessary maintenance by 35%',
        'Extend asset lifespan by 18 months average',
        'Lower spare parts inventory costs by $12K/year',
        'Improve workforce efficiency',
      ],
      risks: [
        'Requires sensor installation ($8K one-time cost)',
        '2-week learning curve for maintenance team',
        'Depends on reliable sensor data',
      ],
      implementation: [
        { step: 'Install IoT sensors on 12 assets', duration: '1 week' },
        { step: 'Train maintenance team on new system', duration: '3 days' },
        { step: 'Calibrate AI models with baseline data', duration: '2 weeks' },
        { step: 'Transition to condition-based scheduling', duration: 'Ongoing' },
      ],
      dataSources: [
        'Historical maintenance records (3 years)',
        'Asset performance metrics',
        'Industry benchmarks',
        'Sensor data from similar assets',
      ],
      affectedAssets: ['PUMP-A-142', 'MOTOR-B-456', 'COMP-C-789', '+9 more'],
    },
    {
      id: 2,
      category: 'efficiency',
      title: 'Consolidate Inspection Routes',
      subtitle: 'Save 8 hours/week with optimized routing',
      impact: '32%',
      impactLabel: 'Time Reduction',
      confidence: 87,
      urgency: 'medium',
      timeframe: '7 days to implement',
      icon: '🗺️',
      color: ['#3b82f6', '#2563eb'],
      summary: 'Route optimization AI found inefficiencies in current inspection paths, suggesting 3 consolidated routes instead of 7.',
      benefits: [
        'Reduce travel time by 32%',
        'Complete inspections 2 days faster',
        'Lower fuel costs by $450/month',
        'Inspect 15% more assets per route',
      ],
      risks: [
        'Requires inspector schedule adjustment',
        'May need additional training',
        'Weather-dependent in some cases',
      ],
      implementation: [
        { step: 'Review proposed route maps', duration: '1 day' },
        { step: 'Test new routes with pilot group', duration: '3 days' },
        { step: 'Gather feedback and adjust', duration: '2 days' },
        { step: 'Roll out to all inspectors', duration: '1 day' },
      ],
      dataSources: [
        'GPS tracking data (6 months)',
        'Asset locations and frequencies',
        'Inspector availability patterns',
        'Traffic and accessibility data',
      ],
      affectedAssets: ['All 247 assets across 4 buildings'],
    },
    {
      id: 3,
      category: 'risk',
      title: 'Priority Upgrade: Aging Pump Systems',
      subtitle: 'High failure risk detected in 3 critical pumps',
      impact: '87%',
      impactLabel: 'Failure Probability',
      confidence: 94,
      urgency: 'critical',
      timeframe: 'Action required within 14 days',
      icon: '🚨',
      color: ['#ef4444', '#dc2626'],
      summary: 'Three hydraulic pumps show severe degradation signs. Failure would halt production and cost $45K+ in downtime.',
      benefits: [
        'Prevent catastrophic failure',
        'Avoid $45K+ downtime costs',
        'Maintain production continuity',
        'Improve system reliability',
      ],
      risks: [
        'Upgrade cost: $18,500',
        '3-day production slowdown during installation',
        'Temporary reduced capacity',
      ],
      implementation: [
        { step: 'Emergency inspection of all 3 pumps', duration: '2 days' },
        { step: 'Order replacement components', duration: '5 days' },
        { step: 'Schedule installation window', duration: '1 day' },
        { step: 'Replace and test systems', duration: '3 days' },
      ],
      dataSources: [
        'Real-time vibration sensors',
        'Temperature monitoring',
        'Acoustic analysis',
        'Maintenance history',
      ],
      affectedAssets: ['PUMP-A-142', 'PUMP-A-145', 'PUMP-A-189'],
    },
    {
      id: 4,
      category: 'maintenance',
      title: 'Implement Predictive Oil Analysis',
      subtitle: 'Detect issues 60 days earlier than visual inspection',
      impact: '$22,800',
      impactLabel: 'Avoided Repairs',
      confidence: 82,
      urgency: 'low',
      timeframe: '90 days to full deployment',
      icon: '🔬',
      color: ['#8b5cf6', '#7c3aed'],
      summary: 'Oil analysis AI can detect contamination and degradation patterns 2 months before visible symptoms appear.',
      benefits: [
        'Early warning system for lubrication issues',
        'Reduce unplanned downtime by 40%',
        'Extend oil change intervals by 25%',
        'Lower maintenance costs',
      ],
      risks: [
        'Requires oil sampling equipment ($2,500)',
        'Monthly lab analysis fees ($400)',
        'Training needed for sample collection',
      ],
      implementation: [
        { step: 'Select pilot assets for oil analysis', duration: '1 week' },
        { step: 'Purchase sampling equipment', duration: '2 weeks' },
        { step: 'Establish baseline oil conditions', duration: '1 month' },
        { step: 'Roll out monthly sampling program', duration: 'Ongoing' },
      ],
      dataSources: [
        'Oil analysis lab results',
        'Asset operating conditions',
        'Historical failure patterns',
        'Industry best practices',
      ],
      affectedAssets: ['15 high-value rotating equipment'],
    },
    {
      id: 5,
      category: 'efficiency',
      title: 'Automate Data Entry with AI Vision',
      subtitle: 'Eliminate 12 hours/week of manual data entry',
      impact: '95%',
      impactLabel: 'Automation Rate',
      confidence: 89,
      urgency: 'medium',
      timeframe: '45 days to deployment',
      icon: '📸',
      color: ['#f59e0b', '#d97706'],
      summary: 'Computer vision AI can automatically extract data from gauge readings, nameplates, and inspection photos.',
      benefits: [
        'Save 12 hours/week of manual entry',
        'Reduce human data entry errors by 95%',
        'Instant digitization of analog readings',
        'Improve inspection speed by 40%',
      ],
      risks: [
        'Requires good photo quality',
        'May need lighting improvements',
        'Initial accuracy tuning period',
      ],
      implementation: [
        { step: 'Deploy AI vision model', duration: '1 week' },
        { step: 'Train on existing asset photos', duration: '2 weeks' },
        { step: 'Pilot with inspector group', duration: '2 weeks' },
        { step: 'Full rollout and optimization', duration: '2 weeks' },
      ],
      dataSources: [
        'Historical inspection photos (5,000+)',
        'Gauge and nameplate templates',
        'OCR and computer vision models',
        'Inspector feedback data',
      ],
      affectedAssets: ['All assets with analog gauges (156 assets)'],
    },
  ];

  const filteredInsights = insights.filter(insight => {
    if (filter === 'all') return true;
    return insight.category === filter;
  });

  const categoryCounts = {
    cost: insights.filter(i => i.category === 'cost').length,
    efficiency: insights.filter(i => i.category === 'efficiency').length,
    risk: insights.filter(i => i.category === 'risk').length,
    maintenance: insights.filter(i => i.category === 'maintenance').length,
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'critical': return 'URGENT';
      case 'high': return 'HIGH PRIORITY';
      case 'medium': return 'MEDIUM PRIORITY';
      case 'low': return 'LOW PRIORITY';
      default: return 'NORMAL';
    }
  };

  const openCardDetails = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
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
        <Text style={styles.headerTitle}>AI Insights</Text>
        <Text style={styles.headerSubtitle}>Smart recommendations powered by data</Text>
      </LinearGradient>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({insights.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'cost' && styles.filterButtonActive]}
          onPress={() => setFilter('cost')}
        >
          <Text style={[styles.filterText, filter === 'cost' && styles.filterTextActive]}>
            💰 Cost ({categoryCounts.cost})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'efficiency' && styles.filterButtonActive]}
          onPress={() => setFilter('efficiency')}
        >
          <Text style={[styles.filterText, filter === 'efficiency' && styles.filterTextActive]}>
            ⚡ Efficiency ({categoryCounts.efficiency})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'risk' && styles.filterButtonActive]}
          onPress={() => setFilter('risk')}
        >
          <Text style={[styles.filterText, filter === 'risk' && styles.filterTextActive]}>
            🚨 Risk ({categoryCounts.risk})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'maintenance' && styles.filterButtonActive]}
          onPress={() => setFilter('maintenance')}
        >
          <Text style={[styles.filterText, filter === 'maintenance' && styles.filterTextActive]}>
            🔧 Maintenance ({categoryCounts.maintenance})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Insight Cards */}
      <ScrollView
        style={styles.cardsContainer}
        contentContainerStyle={styles.cardsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredInsights.map((insight) => (
          <TouchableOpacity
            key={insight.id}
            style={styles.insightCard}
            onPress={() => openCardDetails(insight)}
            activeOpacity={0.95}
          >
            <LinearGradient
              colors={insight.color}
              style={styles.cardGradient}
            >
              {/* Urgency Badge */}
              <View
                style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyColor(insight.urgency) },
                ]}
              >
                <Text style={styles.urgencyText}>
                  {getUrgencyLabel(insight.urgency)}
                </Text>
              </View>

              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{insight.icon}</Text>
                <View style={styles.cardTitles}>
                  <Text style={styles.cardTitle}>{insight.title}</Text>
                  <Text style={styles.cardSubtitle}>{insight.subtitle}</Text>
                </View>
              </View>

              {/* Impact Metric */}
              <View style={styles.impactContainer}>
                <Text style={styles.impactValue}>{insight.impact}</Text>
                <Text style={styles.impactLabel}>{insight.impactLabel}</Text>
              </View>

              {/* Confidence Bar */}
              <View style={styles.confidenceContainer}>
                <View style={styles.confidenceBar}>
                  <View
                    style={[styles.confidenceBarFill, { width: `${insight.confidence}%` }]}
                  />
                </View>
                <Text style={styles.confidenceText}>{insight.confidence}% Confidence</Text>
              </View>

              {/* Timeframe */}
              <View style={styles.timeframeContainer}>
                <Text style={styles.timeframeIcon}>⏱️</Text>
                <Text style={styles.timeframeText}>{insight.timeframe}</Text>
              </View>

              {/* View Details */}
              <View style={styles.viewDetailsContainer}>
                <Text style={styles.viewDetailsText}>Tap for full analysis →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedCard && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalTitleContainer}>
                      <Text style={styles.modalIcon}>{selectedCard.icon}</Text>
                      <Text style={styles.modalTitle}>{selectedCard.title}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <LinearGradient
                    colors={selectedCard.color}
                    style={styles.modalImpactCard}
                  >
                    <Text style={styles.modalImpactValue}>{selectedCard.impact}</Text>
                    <Text style={styles.modalImpactLabel}>{selectedCard.impactLabel}</Text>
                    <View style={styles.modalConfidenceBadge}>
                      <Text style={styles.modalConfidenceText}>
                        {selectedCard.confidence}% AI Confidence
                      </Text>
                    </View>
                  </LinearGradient>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>📋 Summary</Text>
                    <Text style={styles.modalText}>{selectedCard.summary}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>✅ Benefits</Text>
                    {selectedCard.benefits.map((benefit, index) => (
                      <View key={index} style={styles.listItem}>
                        <Text style={styles.listBullet}>•</Text>
                        <Text style={styles.listText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>⚠️ Risks & Considerations</Text>
                    {selectedCard.risks.map((risk, index) => (
                      <View key={index} style={styles.listItem}>
                        <Text style={styles.listBullet}>•</Text>
                        <Text style={styles.listText}>{risk}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>🗓️ Implementation Plan</Text>
                    {selectedCard.implementation.map((step, index) => (
                      <View key={index} style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.stepContent}>
                          <Text style={styles.stepText}>{step.step}</Text>
                          <Text style={styles.stepDuration}>{step.duration}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>📊 Data Sources</Text>
                    {selectedCard.dataSources.map((source, index) => (
                      <View key={index} style={styles.sourceItem}>
                        <Text style={styles.sourceDot}>◉</Text>
                        <Text style={styles.sourceText}>{source}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>🎯 Affected Assets</Text>
                    <View style={styles.assetsContainer}>
                      {selectedCard.affectedAssets.map((asset, index) => (
                        <View key={index} style={styles.assetChip}>
                          <Text style={styles.assetChipText}>{asset}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity style={styles.actionButton}>
                    <LinearGradient
                      colors={selectedCard.color}
                      style={styles.actionButtonGradient}
                    >
                      <Text style={styles.actionButtonText}>Implement This Insight</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  filtersScroll: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  cardsContainer: {
    flex: 1,
  },
  cardsContent: {
    paddingHorizontal: 30,
    paddingTop: 12,
  },
  insightCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    padding: 20,
  },
  urgencyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  cardTitles: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  impactContainer: {
    marginBottom: 16,
  },
  impactValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeframeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  timeframeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  viewDetailsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#64748b',
  },
  modalImpactCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImpactValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  modalImpactLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  modalConfidenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalConfidenceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
    fontWeight: '700',
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  stepDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceDot: {
    fontSize: 12,
    color: '#3b82f6',
    marginRight: 8,
  },
  sourceText: {
    fontSize: 14,
    color: '#64748b',
  },
  assetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assetChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  assetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default InsightCardsScreen;
