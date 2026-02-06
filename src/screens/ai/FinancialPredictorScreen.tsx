// WORKING VERSION - FinancialPredictorScreen.tsx
// Replace your current file with this
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ImpactScenario {
  id: string;
  action: string;
  description: string;
  financialImpact: number;
  timeframe: string;
  probability: number;
  category: 'savings' | 'cost' | 'risk';
  urgency: 'immediate' | 'short-term' | 'long-term';
}

interface BudgetPrediction {
  nextQuarter: number;
  nextYear: number;
  factors: string[];
}

const FinancialPredictorScreen = ({ navigation }) => {
  const [scenarios, setScenarios] = useState<ImpactScenario[]>([]);
  const [budgetPrediction, setBudgetPrediction] = useState<BudgetPrediction | null>(null);
  const [showOnlySavings, setShowOnlySavings] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Simulation Modal State
  const [simulationVisible, setSimulationVisible] = useState(false);
  const [simulationInput, setSimulationInput] = useState('');
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      // Mock data - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setScenarios([
        {
          id: '1',
          action: 'Switch to Preventive Maintenance',
          description: 'Move 12 critical assets from reactive to preventive maintenance schedule. Reduces emergency repairs by 65%.',
          financialImpact: 28000,
          timeframe: '6 months',
          probability: 0.89,
          category: 'savings',
          urgency: 'short-term',
        },
        {
          id: '2',
          action: 'Optimize Inspection Routes',
          description: 'AI-optimized routing can reduce travel time by 25% and fuel costs by $1,200/month.',
          financialImpact: 14400,
          timeframe: '12 months',
          probability: 0.95,
          category: 'savings',
          urgency: 'immediate',
        },
        {
          id: '3',
          action: 'Delay HVAC System Replacement',
          description: 'Delaying replacement beyond recommended date increases breakdown risk and emergency repair costs.',
          financialImpact: -45000,
          timeframe: '3 months',
          probability: 0.72,
          category: 'cost',
          urgency: 'immediate',
        },
        {
          id: '4',
          action: 'Install IoT Sensors',
          description: 'Real-time monitoring for 8 high-risk assets. Prevents failures and reduces downtime by 40%.',
          financialImpact: 22000,
          timeframe: '18 months',
          probability: 0.78,
          category: 'savings',
          urgency: 'long-term',
        },
      ]);

      setBudgetPrediction({
        nextQuarter: 125000,
        nextYear: 485000,
        factors: [
          'Expected seasonal maintenance spike in Q3',
          '3 major assets approaching end-of-life',
          'Inflation adjustment (+4.2%)',
          'New regulatory compliance requirements',
        ],
      });
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioPress = (scenario: ImpactScenario) => {
    Alert.alert(
      scenario.action,
      `${scenario.description}\n\nFinancial Impact: ${formatCurrency(scenario.financialImpact)}\nTimeframe: ${scenario.timeframe}\nProbability: ${Math.round(scenario.probability * 100)}%`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View Details',
          onPress: () => {
            Alert.alert(
              'Implementation Steps',
              '1. Review current process\n2. Plan implementation\n3. Execute changes\n4. Measure results',
              [
                { text: 'OK' },
                {
                  text: 'Implement',
                  onPress: () => {
                    Alert.alert('Success!', 'Recommendation added to your action plan.');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleApplyOptimization = () => {
    Alert.alert(
      'Apply Optimization',
      'This will optimize today\'s inspection routes and save 4 hours ($1,200).\n\nProceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            Alert.alert(
              '✅ Optimization Applied!',
              'Routes have been optimized. You can view the new schedule in the Inspections tab.'
            );
          },
        },
      ]
    );
  };

  const runSimulation = async () => {
    if (!simulationInput.trim()) {
      Alert.alert('Error', 'Please enter a scenario');
      return;
    }

    setSimulationLoading(true);
    setSimulationResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult = {
        scenario: simulationInput,
        financialImpact: Math.floor(Math.random() * 50000) + 10000,
        probability: Math.random() * 0.5 + 0.5,
        breakdown: {
          laborCosts: Math.floor(Math.random() * 20000),
          materialCosts: Math.floor(Math.random() * 15000),
          downtimeCosts: Math.floor(Math.random() * 10000),
          savings: Math.floor(Math.random() * 25000),
        },
        recommendation: 'Based on historical data and current trends, this scenario is feasible with moderate risk.',
      };

      setSimulationResult(mockResult);
    } catch (error) {
      Alert.alert('Error', 'Failed to run simulation');
    } finally {
      setSimulationLoading(false);
    }
  };

  const getImpactColor = (category: string) => {
    switch (category) {
      case 'savings':
        return ['#10b981', '#059669'];
      case 'cost':
        return ['#ef4444', '#dc2626'];
      case 'risk':
        return ['#f59e0b', '#d97706'];
      default:
        return ['#6b7280', '#4b5563'];
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return { text: 'NOW', color: '#ef4444' };
      case 'short-term':
        return { text: '7 DAYS', color: '#f59e0b' };
      case 'long-term':
        return { text: '30 DAYS', color: '#3b82f6' };
      default:
        return { text: 'LATER', color: '#6b7280' };
    }
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formatted = `$${absAmount.toLocaleString()}`;
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  const filteredScenarios = showOnlySavings
    ? scenarios.filter((s) => s.category === 'savings')
    : scenarios;

  const totalPotentialSavings = scenarios
    .filter((s) => s.category === 'savings')
    .reduce((sum, s) => sum + s.financialImpact, 0);

  const totalPotentialCosts = scenarios
    .filter((s) => s.category === 'cost')
    .reduce((sum, s) => sum + Math.abs(s.financialImpact), 0);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#10b981', '#059669']} style={styles.header}>
          <Text style={styles.headerTitle}>💰 Financial AI Predictor</Text>
          <Text style={styles.headerSubtitle}>
            Real-time ROI for every decision
          </Text>
        </LinearGradient>

        {/* Total Impact Summary */}
        <View style={styles.section}>
          <View style={styles.summaryGrid}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.summaryCard}
            >
              <Text style={styles.summaryLabel}>POTENTIAL SAVINGS</Text>
              <Text style={styles.summaryValue}>
                ${totalPotentialSavings.toLocaleString()}
              </Text>
              <Text style={styles.summarySubtext}>Available now</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.summaryCard}
            >
              <Text style={styles.summaryLabel}>POTENTIAL COSTS</Text>
              <Text style={styles.summaryValue}>
                ${totalPotentialCosts.toLocaleString()}
              </Text>
              <Text style={styles.summarySubtext}>If delayed</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Filter Toggle */}
        <View style={styles.section}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Show only savings opportunities</Text>
            <Switch
              value={showOnlySavings}
              onValueChange={setShowOnlySavings}
              trackColor={{ false: '#cbd5e1', true: '#10b981' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Impact Scenarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Impact Scenarios</Text>
          {filteredScenarios.map((scenario) => {
            const urgencyBadge = getUrgencyBadge(scenario.urgency);
            return (
              <TouchableOpacity
                key={scenario.id}
                style={styles.scenarioCard}
                onPress={() => handleScenarioPress(scenario)}
                activeOpacity={0.7}
              >
                <View style={styles.scenarioHeader}>
                  <View style={styles.scenarioTitleContainer}>
                    <Text style={styles.scenarioAction}>{scenario.action}</Text>
                    <View
                      style={[
                        styles.urgencyBadge,
                        { backgroundColor: urgencyBadge.color },
                      ]}
                    >
                      <Text style={styles.urgencyText}>{urgencyBadge.text}</Text>
                    </View>
                  </View>
                  <LinearGradient
                    colors={getImpactColor(scenario.category)}
                    style={styles.impactBadge}
                  >
                    <Text style={styles.impactValue}>
                      {formatCurrency(scenario.financialImpact)}
                    </Text>
                  </LinearGradient>
                </View>

                <Text style={styles.scenarioDescription}>
                  {scenario.description}
                </Text>

                <View style={styles.scenarioFooter}>
                  <View style={styles.probabilityContainer}>
                    <Text style={styles.probabilityLabel}>Probability:</Text>
                    <View style={styles.probabilityBar}>
                      <View
                        style={[
                          styles.probabilityFill,
                          {
                            width: `${scenario.probability * 100}%`,
                            backgroundColor:
                              scenario.probability > 0.7
                                ? '#10b981'
                                : scenario.probability > 0.4
                                ? '#f59e0b'
                                : '#ef4444',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.probabilityValue}>
                      {Math.round(scenario.probability * 100)}%
                    </Text>
                  </View>
                  <Text style={styles.timeframe}>⏱️ {scenario.timeframe}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Budget Prediction */}
        {budgetPrediction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Budget Prediction</Text>

            <View style={styles.budgetCard}>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Next Quarter Needed:</Text>
                <Text style={styles.budgetValue}>
                  ${budgetPrediction.nextQuarter.toLocaleString()}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Annual Projection:</Text>
                <Text style={styles.budgetValue}>
                  ${budgetPrediction.nextYear.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.factorsCard}>
              <Text style={styles.factorsTitle}>🎯 Key Factors:</Text>
              {budgetPrediction.factors.map((factor, index) => (
                <View key={index} style={styles.factorItem}>
                  <Text style={styles.factorBullet}>•</Text>
                  <Text style={styles.factorText}>{factor}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Simulation Tool */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 What-If Simulator</Text>

          <View style={styles.simulatorCard}>
            <Text style={styles.simulatorTitle}>
              Test different scenarios to see financial impact
            </Text>

            <TouchableOpacity 
              style={styles.simulatorButton}
              onPress={() => setSimulationVisible(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.simulatorGradient}
              >
                <Text style={styles.simulatorButtonText}>
                  🧪 Run Simulation
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Example scenarios:</Text>
              <Text style={styles.exampleText}>
                • "What if I hire 2 more technicians?"
              </Text>
              <Text style={styles.exampleText}>
                • "What if I delay maintenance by 3 months?"
              </Text>
              <Text style={styles.exampleText}>
                • "What if I upgrade to IoT sensors?"
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Wins */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Wins</Text>

          <LinearGradient
            colors={['#f0fdf4', '#dcfce7']}
            style={styles.quickWinCard}
          >
            <View style={styles.quickWinHeader}>
              <Text style={styles.quickWinIcon}>🎯</Text>
              <View style={styles.quickWinBadge}>
                <Text style={styles.quickWinBadgeText}>TOP PRIORITY</Text>
              </View>
            </View>
            <Text style={styles.quickWinTitle}>
              Optimize Today's Inspection Routes
            </Text>
            <Text style={styles.quickWinDescription}>
              AI detected inefficient routing. Reordering visits can save 4 hours and $1,200 today.
            </Text>
            <TouchableOpacity 
              style={styles.quickWinButton}
              onPress={handleApplyOptimization}
              activeOpacity={0.8}
            >
              <Text style={styles.quickWinButtonText}>
                Apply Optimization →
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Track Record */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Your Track Record</Text>

          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                AI Recommendations Followed:
              </Text>
              <Text style={styles.performanceValue}>87%</Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Total Savings Realized (YTD):
              </Text>
              <Text style={[styles.performanceValue, { color: '#10b981' }]}>
                $156,240
              </Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Costs Avoided (YTD):
              </Text>
              <Text style={[styles.performanceValue, { color: '#10b981' }]}>
                $289,500
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Simulation Modal - INLINE */}
      <Modal
        visible={simulationVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSimulationVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎮 What-If Simulator</Text>
              <TouchableOpacity onPress={() => {
                setSimulationVisible(false);
                setSimulationResult(null);
                setSimulationInput('');
              }}>
                <Ionicons name="close" size={28} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Enter your scenario:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., What if I hire 2 more technicians?"
                  value={simulationInput}
                  onChangeText={setSimulationInput}
                  multiline
                />

                <TouchableOpacity
                  style={styles.modalRunButton}
                  onPress={runSimulation}
                  disabled={simulationLoading}
                >
                  <LinearGradient
                    colors={['#8b5cf6', '#7c3aed']}
                    style={styles.modalRunGradient}
                  >
                    {simulationLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalRunText}>🧪 Run Simulation</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {simulationResult && (
                <View style={styles.modalSection}>
                  <Text style={styles.resultTitle}>📊 Results</Text>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.resultCard}
                  >
                    <Text style={styles.resultLabel}>Financial Impact</Text>
                    <Text style={styles.resultValue}>
                      +${simulationResult.financialImpact.toLocaleString()}
                    </Text>
                    <Text style={styles.resultSubtext}>
                      {Math.round(simulationResult.probability * 100)}% Confidence
                    </Text>
                  </LinearGradient>

                  <View style={styles.breakdownCard}>
                    <Text style={styles.breakdownTitle}>Breakdown:</Text>
                    <Text style={styles.breakdownText}>
                      Labor: ${simulationResult.breakdown.laborCosts.toLocaleString()}
                    </Text>
                    <Text style={styles.breakdownText}>
                      Materials: ${simulationResult.breakdown.materialCosts.toLocaleString()}
                    </Text>
                    <Text style={styles.breakdownText}>
                      Downtime: ${simulationResult.breakdown.downtimeCosts.toLocaleString()}
                    </Text>
                    <Text style={[styles.breakdownText, { color: '#10b981', fontWeight: '700' }]}>
                      Savings: ${simulationResult.breakdown.savings.toLocaleString()}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
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
    color: '#d1fae5',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  summarySubtext: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  scenarioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scenarioTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  scenarioAction: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  impactBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  scenarioFooter: {
    gap: 12,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  probabilityLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  probabilityBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 3,
  },
  probabilityValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  timeframe: {
    fontSize: 12,
    color: '#64748b',
  },
  budgetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  budgetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  factorsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  factorBullet: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 8,
  },
  factorText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  simulatorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  simulatorTitle: {
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 16,
    lineHeight: 22,
  },
  simulatorButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  simulatorGradient: {
    padding: 16,
    alignItems: 'center',
  },
  simulatorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  examplesContainer: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  examplesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  quickWinCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  quickWinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickWinIcon: {
    fontSize: 32,
  },
  quickWinBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickWinBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  quickWinTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  quickWinDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  quickWinButton: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickWinButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalSection: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalRunButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalRunGradient: {
    padding: 16,
    alignItems: 'center',
  },
  modalRunText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  resultCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  resultSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  breakdownCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  breakdownText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
});

export default FinancialPredictorScreen;