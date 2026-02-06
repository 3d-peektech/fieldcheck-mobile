import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.fieldcheck.app'; // Replace with your actual API

const FinancialPredictor = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [impactScenarios, setImpactScenarios] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    loadPredictions();
  }, [selectedPeriod]);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = await AsyncStorage.getItem('authToken');
      
      // Fetch REAL predictions from backend
      const response = await axios.get(
        `${API_BASE_URL}/api/financial/predict`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { period: selectedPeriod }
        }
      );

      setPredictions(response.data.predictions);
      setImpactScenarios(response.data.impactScenarios);
      setLoading(false);
    } catch (error) {
      console.error('Error loading predictions:', error);
      
      // Fallback to demo data if API fails (for development only)
      if (__DEV__) {
        loadDemoData();
      } else {
        Alert.alert('Error', 'Failed to load financial predictions. Please try again.');
        setLoading(false);
      }
    }
  };

  const loadDemoData = () => {
    // Demo data for development - REMOVE in production
    setPredictions({
      totalCost: 45250,
      preventiveCost: 28500,
      reactiveCost: 16750,
      potentialSavings: 12300,
      riskLevel: 'Medium',
      confidence: 87,
    });

    setImpactScenarios([
      {
        id: 1,
        title: 'Increase Preventive Maintenance',
        impact: '+23%',
        cost: -8400,
        description: 'Schedule more frequent inspections to catch issues early',
        recommendation: 'Monthly preventive checks reduce emergency repairs by 40%',
      },
      {
        id: 2,
        title: 'Replace Aging Assets',
        impact: '+15%',
        cost: 12000,
        description: 'Replace 3 critical assets nearing end of life',
        recommendation: 'Upfront cost saves $18k in repairs over next year',
      },
      {
        id: 3,
        title: 'Implement Predictive Monitoring',
        impact: '+31%',
        cost: -14200,
        description: 'Install IoT sensors on high-value equipment',
        recommendation: 'Real-time monitoring prevents 80% of unexpected failures',
      },
      {
        id: 4,
        title: 'Optimize Inspection Schedule',
        impact: '+12%',
        cost: -5600,
        description: 'AI-optimized inspection frequency based on asset condition',
        recommendation: 'Reduce over-inspection while maintaining safety',
      },
    ]);
    
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPredictions();
    setRefreshing(false);
  };

  const handleScenarioPress = (scenario) => {
    navigation.navigate('ImpactDetails', { scenario });
  };

  const handleAddToActionPlan = async (scenario) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      // Save to backend
      await axios.post(
        `${API_BASE_URL}/api/financial/action-plan/add`,
        {
          scenarioId: scenario.id,
          title: scenario.title,
          impact: scenario.impact,
          cost: scenario.cost,
          recommendation: scenario.recommendation,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert(
        'Success',
        'Recommendation added to your Action Plan',
        [
          { text: 'View Action Plan', onPress: () => navigation.navigate('ActionPlan') },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      console.error('Error saving to action plan:', error);
      Alert.alert('Error', 'Failed to save recommendation. Please try again.');
    }
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case '3months': return '3 Months';
      case '6months': return '6 Months';
      case '1year': return '1 Year';
      case '2years': return '2 Years';
      default: return '6 Months';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b59b6" />
        <Text style={styles.loadingText}>Analyzing financial data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <Text style={styles.periodLabel}>Forecast Period:</Text>
        <View style={styles.periodButtons}>
          {['3months', '6months', '1year', '2years'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {getPeriodLabel(period)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Predictions Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Cost Forecast</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Estimated</Text>
            <Text style={styles.summaryValue}>${predictions.totalCost.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Potential Savings</Text>
            <Text style={[styles.summaryValue, { color: '#27ae60' }]}>
              ${predictions.potentialSavings.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Preventive</Text>
            <Text style={styles.summaryValue}>${predictions.preventiveCost.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Reactive</Text>
            <Text style={styles.summaryValue}>${predictions.reactiveCost.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>AI Confidence:</Text>
          <View style={styles.confidenceBar}>
            <View 
              style={[styles.confidenceFill, { width: `${predictions.confidence}%` }]} 
            />
          </View>
          <Text style={styles.confidenceText}>{predictions.confidence}%</Text>
        </View>
      </View>

      {/* Impact Scenarios */}
      <View style={styles.scenariosSection}>
        <Text style={styles.sectionTitle}>Impact Scenarios</Text>
        <Text style={styles.sectionSubtitle}>
          See how different strategies affect your costs
        </Text>

        {impactScenarios.map((scenario) => (
          <View key={scenario.id} style={styles.scenarioCard}>
            <View style={styles.scenarioHeader}>
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <View style={[
                styles.impactBadge,
                { backgroundColor: scenario.cost < 0 ? '#27ae60' : '#e67e22' }
              ]}>
                <Text style={styles.impactText}>{scenario.impact}</Text>
              </View>
            </View>

            <Text style={styles.scenarioDescription}>{scenario.description}</Text>

            <View style={styles.scenarioCost}>
              <Text style={styles.costLabel}>Impact on Budget:</Text>
              <Text style={[
                styles.costValue,
                { color: scenario.cost < 0 ? '#27ae60' : '#e74c3c' }
              ]}>
                {scenario.cost < 0 ? '-' : '+'} ${Math.abs(scenario.cost).toLocaleString()}
              </Text>
            </View>

            <View style={styles.scenarioActions}>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleScenarioPress(scenario)}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToActionPlan(scenario)}
              >
                <Text style={styles.addButtonText}>+ Add to Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.viewActionPlanButton}
        onPress={() => navigation.navigate('ActionPlan')}
      >
        <Text style={styles.viewActionPlanText}>📋 View Full Action Plan</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  periodSelector: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#9b59b6',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 10,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 10,
    width: 40,
  },
  scenariosSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  scenarioCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scenarioTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  impactBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  impactText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  scenarioCost: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    marginBottom: 10,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  costValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scenarioActions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#9b59b6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewActionPlanButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 15,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewActionPlanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinancialPredictor;
