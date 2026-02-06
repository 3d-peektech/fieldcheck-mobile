// FinancialAIScreen.js
// Financial AI Predictor - Exactly like your screenshot
// Location: src/screens/FinancialAI/FinancialAIScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function FinancialAIScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Financial decisions data
  const [decisions, setDecisions] = useState([
    {
      id: '1',
      title: 'Switch to Preventive Maintenance',
      category: 'savings',
      description: 'Move 12 critical assets from reactive to preventive maintenance schedule. Reduces emergency repairs by 65%.',
      financialImpact: 28000,
      timeframe: '6 months',
      probability: 89,
      confidence: 91,
      urgency: '7 DAYS',
      risks: [
        'Spare stock availability',
        'Labor constraints',
        'Temporary production slowdown'
      ],
      benefits: [
        'Reduce emergency repairs by 65%',
        'Increase asset lifespan by 18 months',
        'Stabilize maintenance budget'
      ],
      dataSource: '17 similar historical cases',
      affectedAssets: 12,
    },
    {
      id: '2',
      title: 'Delay Compressor Overhaul',
      category: 'costs',
      description: 'Current degradation rate allows safe operation for 3 more months. Delaying provides financial flexibility.',
      financialImpact: -15000,
      timeframe: '3 months',
      probability: 76,
      confidence: 84,
      urgency: '45 DAYS',
      risks: [
        'Sudden failure (12% chance)',
        'Increased wear on related components',
        'Higher repair cost if failure occurs'
      ],
      benefits: [
        'Cash flow preservation',
        'Bundle with scheduled shutdown',
        'Wait for spare parts price drop'
      ],
      dataSource: '23 similar historical cases',
      affectedAssets: 1,
    },
    {
      id: '3',
      title: 'Upgrade Cooling System',
      category: 'savings',
      description: 'Energy consumption trending 18% above baseline. New system ROI in 14 months.',
      financialImpact: 45000,
      timeframe: '14 months',
      probability: 82,
      confidence: 88,
      urgency: '30 DAYS',
      risks: [
        'Initial capital investment',
        'Installation downtime (2 days)',
        'Learning curve for operators'
      ],
      benefits: [
        'Reduce energy costs by 22%',
        'Lower carbon footprint',
        'Improved temperature stability'
      ],
      dataSource: '9 similar historical cases',
      affectedAssets: 3,
    },
    {
      id: '4',
      title: 'Extend Bearing Replacement Cycle',
      category: 'costs',
      description: 'Bearings showing better-than-expected performance. Safe to extend replacement by 4 months.',
      financialImpact: -8500,
      timeframe: '4 months',
      probability: 71,
      confidence: 79,
      urgency: '90 DAYS',
      risks: [
        'Monitoring overhead',
        'Potential bearing failure',
        'Unplanned downtime'
      ],
      benefits: [
        'Reduce spare parts inventory',
        'Lower maintenance labor costs',
        'Data-driven scheduling'
      ],
      dataSource: '31 similar historical cases',
      affectedAssets: 8,
    },
  ]);

  const [totalSavings, setTotalSavings] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);

  useEffect(() => {
    loadPreferences();
    calculateTotals();
  }, []);

  const loadPreferences = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      if (darkMode) setIsDarkMode(darkMode === 'true');
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const calculateTotals = () => {
    const savings = decisions
      .filter(d => d.category === 'savings')
      .reduce((sum, d) => sum + d.financialImpact, 0);
    
    const costs = decisions
      .filter(d => d.category === 'costs')
      .reduce((sum, d) => sum + Math.abs(d.financialImpact), 0);
    
    setTotalSavings(savings);
    setTotalCosts(costs);
  };

  const colors = isDarkMode ? {
    background: '#0A0E12',
    card: '#1A1F26',
    cardBorder: '#2A2F36',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    primary: '#10B981',
    success: '#10B981',
    danger: '#EF4444',
  } : {
    background: '#F3F4F6',
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    primary: '#10B981',
    success: '#10B981',
    danger: '#EF4444',
  };

  const DecisionCard = ({ decision }) => {
    const isPositive = decision.category === 'savings';
    const impactColor = isPositive ? colors.success : colors.danger;

    return (
      <TouchableOpacity
        style={[styles.decisionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => {
          setSelectedDecision(decision);
          setShowDetailModal(true);
        }}
        activeOpacity={0.8}
      >
        {/* Urgency Badge */}
        <View style={[styles.urgencyBadge, { backgroundColor: '#F59E0B' }]}>
          <Text style={styles.urgencyText}>{decision.urgency}</Text>
        </View>

        {/* Header */}
        <View style={styles.decisionHeader}>
          <Text style={[styles.decisionTitle, { color: colors.text }]}>
            {decision.title}
          </Text>
        </View>

        {/* Description */}
        <Text style={[styles.decisionDescription, { color: colors.textSecondary }]}>
          {decision.description}
        </Text>

        {/* Financial Impact */}
        <View style={styles.financialSection}>
          <Text style={[styles.financialLabel, { color: colors.textSecondary }]}>
            Financial Impact:
          </Text>
          <Text style={[styles.financialValue, { color: impactColor }]}>
            {isPositive ? '+' : ''}{decision.financialImpact >= 0 ? '+' : ''}{decision.financialImpact >= 0 && !isPositive ? '-' : ''}${Math.abs(decision.financialImpact).toLocaleString()}
          </Text>
        </View>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Timeframe
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {decision.timeframe}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Probability
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {decision.probability}%
            </Text>
          </View>
        </View>

        {/* Probability Bar */}
        <View style={styles.probabilityContainer}>
          <Text style={[styles.probabilityLabel, { color: colors.textSecondary }]}>
            Probability:
          </Text>
          <View style={styles.probabilityBarContainer}>
            <View 
              style={[styles.probabilityBar, { 
                width: `${decision.probability}%`,
                backgroundColor: colors.success
              }]} 
            />
          </View>
          <Text style={[styles.probabilityValue, { color: colors.text }]}>
            {decision.probability}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#0F766E', '#10B981']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>💰</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Financial AI Predictor</Text>
            <Text style={styles.headerSubtitle}>Real-time ROI for every decision</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.savingsCard]}>
          <Text style={styles.summaryLabel}>POTENTIAL SAVINGS</Text>
          <Text style={styles.summaryValue}>+${totalSavings.toLocaleString()}</Text>
          <View style={styles.summaryCount}>
            <Ionicons name="trending-up" size={14} color="#FFFFFF" />
            <Text style={styles.summaryCountText}>
              {decisions.filter(d => d.category === 'savings').length} opportunities
            </Text>
          </View>
        </View>

        <View style={[styles.summaryCard, styles.costsCard]}>
          <Text style={styles.summaryLabel}>POTENTIAL COSTS</Text>
          <Text style={styles.summaryValue}>-${totalCosts.toLocaleString()}</Text>
          <View style={styles.summaryCount}>
            <Ionicons name="trending-down" size={14} color="#FFFFFF" />
            <Text style={styles.summaryCountText}>
              {decisions.filter(d => d.category === 'costs').length} risks
            </Text>
          </View>
        </View>
      </View>

      {/* Decisions List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {decisions.map((decision) => (
          <DecisionCard key={decision.id} decision={decision} />
        ))}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDecision?.title}
              </Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedDecision && (
                <>
                  <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                    {selectedDecision.description}
                  </Text>

                  <View style={styles.modalMetrics}>
                    <View style={styles.modalMetric}>
                      <Text style={[styles.modalMetricLabel, { color: colors.textSecondary }]}>
                        Financial Impact
                      </Text>
                      <Text style={[styles.modalMetricValue, { 
                        color: selectedDecision.category === 'savings' ? colors.success : colors.danger 
                      }]}>
                        {selectedDecision.category === 'savings' ? '+' : '-'}${Math.abs(selectedDecision.financialImpact).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={[styles.modalMetricLabel, { color: colors.textSecondary }]}>
                        Timeframe
                      </Text>
                      <Text style={[styles.modalMetricValue, { color: colors.text }]}>
                        {selectedDecision.timeframe}
                      </Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={[styles.modalMetricLabel, { color: colors.textSecondary }]}>
                        Probability
                      </Text>
                      <Text style={[styles.modalMetricValue, { color: colors.text }]}>
                        {selectedDecision.probability}%
                      </Text>
                    </View>
                    <View style={styles.modalMetric}>
                      <Text style={[styles.modalMetricLabel, { color: colors.textSecondary }]}>
                        Confidence
                      </Text>
                      <Text style={[styles.modalMetricValue, { color: colors.success }]}>
                        {selectedDecision.confidence}%
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                      Benefits
                    </Text>
                    {selectedDecision.benefits.map((benefit, index) => (
                      <View key={index} style={styles.listItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.listItemText, { color: colors.text }]}>
                          {benefit}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                      Risks
                    </Text>
                    {selectedDecision.risks.map((risk, index) => (
                      <View key={index} style={styles.listItem}>
                        <Ionicons name="alert-circle" size={20} color={colors.danger} />
                        <Text style={[styles.listItemText, { color: colors.text }]}>
                          {risk}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={[styles.modalFooter, { borderTopColor: colors.cardBorder }]}>
                    <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
                    <Text style={[styles.modalFooterText, { color: colors.textSecondary }]}>
                      Based on {selectedDecision.dataSource} • {selectedDecision.affectedAssets} assets affected
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonOutline, { borderColor: colors.primary }]}
                onPress={() => setShowDetailModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.primary }]}>
                  CANCEL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowDetailModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  VIEW DETAILS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -32,
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  savingsCard: {
    backgroundColor: '#10B981',
  },
  costsCard: {
    backgroundColor: '#EF4444',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  summaryCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryCountText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  decisionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    position: 'relative',
  },
  urgencyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  decisionHeader: {
    marginBottom: 12,
    paddingRight: 80,
  },
  decisionTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  decisionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  financialSection: {
    marginBottom: 16,
  },
  financialLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 24,
  },
  metric: {},
  metricLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  probabilityLabel: {
    fontSize: 13,
  },
  probabilityBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  probabilityBar: {
    height: '100%',
    borderRadius: 4,
  },
  probabilityValue: {
    fontSize: 14,
    fontWeight: '700',
    width: 45,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    paddingRight: 16,
  },
  modalDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  modalMetric: {
    width: '50%',
    marginBottom: 16,
  },
  modalMetricLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  modalMetricValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  modalFooterText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonOutline: {
    borderWidth: 2,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
