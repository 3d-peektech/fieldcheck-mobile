// src/screens/ai/ScenarioDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ScenarioDetailScreenProps {
  route: any;
  navigation: any;
}

const ScenarioDetailScreen: React.FC<ScenarioDetailScreenProps> = ({ route, navigation }) => {
  const { scenario } = route.params;

  const handleImplement = () => {
    Alert.alert(
      'Implement Recommendation',
      `Are you sure you want to proceed with:\n\n"${scenario.action}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Implement',
          onPress: () => {
            Alert.alert(
              'Success!',
              'Recommendation added to your action plan. You will receive updates as it progresses.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
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

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formatted = `$${absAmount.toLocaleString()}`;
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{scenario.action}</Text>
        <LinearGradient
          colors={getImpactColor(scenario.category)}
          style={styles.impactBadge}
        >
          <Text style={styles.impactValue}>{formatCurrency(scenario.financialImpact)}</Text>
          <Text style={styles.impactLabel}>Financial Impact</Text>
        </LinearGradient>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Description</Text>
        <View style={styles.card}>
          <Text style={styles.description}>{scenario.description}</Text>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Key Metrics</Text>
        <View style={styles.card}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Probability of Success:</Text>
            <View style={styles.probabilityContainer}>
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
          </View>

          <View style={styles.divider} />

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Timeframe:</Text>
            <Text style={styles.metricValue}>⏱️ {scenario.timeframe}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Category:</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{scenario.category.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Urgency:</Text>
            <Text style={styles.metricValue}>{scenario.urgency}</Text>
          </View>
        </View>
      </View>

      {/* Implementation Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Implementation Steps</Text>
        <View style={styles.card}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Review Current Process</Text>
              <Text style={styles.stepDescription}>
                Analyze existing workflows and identify areas for improvement
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Plan Implementation</Text>
              <Text style={styles.stepDescription}>
                Create detailed action plan with timeline and resources
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Execute Changes</Text>
              <Text style={styles.stepDescription}>
                Roll out changes incrementally and monitor results
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Measure Results</Text>
              <Text style={styles.stepDescription}>
                Track KPIs and adjust strategy as needed
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Risks & Considerations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ Risks & Considerations</Text>
        <View style={styles.card}>
          <View style={styles.riskItem}>
            <Ionicons name="alert-circle" size={20} color="#f59e0b" />
            <Text style={styles.riskText}>
              Initial implementation may require staff training
            </Text>
          </View>
          <View style={styles.riskItem}>
            <Ionicons name="alert-circle" size={20} color="#f59e0b" />
            <Text style={styles.riskText}>
              Temporary productivity dip during transition period
            </Text>
          </View>
          <View style={styles.riskItem}>
            <Ionicons name="alert-circle" size={20} color="#f59e0b" />
            <Text style={styles.riskText}>
              Requires ongoing monitoring and adjustment
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.implementButton} onPress={handleImplement}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>✅ Implement Recommendation</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() =>
            Alert.alert(
              'Schedule Review',
              'This recommendation has been added to your calendar for review next week.'
            )
          }
        >
          <Text style={styles.scheduleButtonText}>📅 Schedule for Later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => Alert.alert('Share', 'Sharing options coming soon!')}
        >
          <Text style={styles.shareButtonText}>🔗 Share with Team</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    lineHeight: 32,
  },
  impactBadge: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  probabilityBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 4,
  },
  probabilityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    minWidth: 45,
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  step: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  riskText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  implementButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scheduleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  scheduleButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScenarioDetailScreen;
