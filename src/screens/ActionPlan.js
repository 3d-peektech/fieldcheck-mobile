import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.fieldcheck.app'; // Replace with your actual API

const ActionPlan = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadActionPlan();
  }, []);

  const loadActionPlan = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      // Fetch REAL action plan from backend
      const response = await axios.get(
        `${API_BASE_URL}/api/financial/action-plan`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRecommendations(response.data.recommendations);
      setCompletedCount(response.data.recommendations.filter(r => r.status === 'completed').length);
      setLoading(false);
    } catch (error) {
      console.error('Error loading action plan:', error);
      
      // Demo data for development
      if (__DEV__) {
        setRecommendations([
          {
            id: 1,
            title: 'Increase Preventive Maintenance',
            description: 'Schedule more frequent inspections to catch issues early',
            impact: '+23%',
            cost: -8400,
            priority: 'high',
            status: 'pending',
            dueDate: '2026-03-15',
            recommendation: 'Monthly preventive checks reduce emergency repairs by 40%',
            addedDate: '2026-02-04',
          },
          {
            id: 2,
            title: 'Replace Aging Assets',
            description: 'Replace 3 critical assets nearing end of life',
            impact: '+15%',
            cost: 12000,
            priority: 'high',
            status: 'in_progress',
            dueDate: '2026-03-01',
            recommendation: 'Upfront cost saves $18k in repairs over next year',
            addedDate: '2026-02-03',
            progress: 60,
          },
          {
            id: 3,
            title: 'Implement Predictive Monitoring',
            description: 'Install IoT sensors on high-value equipment',
            impact: '+31%',
            cost: -14200,
            priority: 'medium',
            status: 'pending',
            dueDate: '2026-04-01',
            recommendation: 'Real-time monitoring prevents 80% of unexpected failures',
            addedDate: '2026-02-01',
          },
        ]);
        setCompletedCount(0);
      } else {
        Alert.alert('Error', 'Failed to load action plan. Please try again.');
      }
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActionPlan();
    setRefreshing(false);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      // Update in backend
      await axios.patch(
        `${API_BASE_URL}/api/financial/action-plan/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id ? { ...rec, status: newStatus } : rec
        )
      );

      if (newStatus === 'completed') {
        setCompletedCount(prev => prev + 1);
        Alert.alert('Success', 'Recommendation marked as completed!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status. Please try again.');
    }
  };

  const deleteRecommendation = async (id) => {
    Alert.alert(
      'Delete Recommendation',
      'Are you sure you want to remove this from your action plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');

              // Delete from backend
              await axios.delete(
                `${API_BASE_URL}/api/financial/action-plan/${id}`,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );

              // Update local state
              setRecommendations(prev => prev.filter(rec => rec.id !== id));
              Alert.alert('Success', 'Recommendation removed');
            } catch (error) {
              console.error('Error deleting recommendation:', error);
              Alert.alert('Error', 'Failed to delete. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'in_progress': return '#3498db';
      case 'pending': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading action plan...</Text>
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
      {/* Summary Header */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Action Plan Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{recommendations.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#3498db' }]}>
              {recommendations.filter(r => r.status === 'in_progress').length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#27ae60' }]}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Recommendations List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>

        {recommendations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No recommendations yet</Text>
            <Text style={styles.emptyText}>
              Add recommendations from the Financial Predictor to create your action plan
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('FinancialPredictor')}
            >
              <Text style={styles.emptyButtonText}>Go to Financial Predictor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recommendations.map((rec) => (
            <View key={rec.id} style={styles.recommendationCard}>
              {/* Header */}
              <View style={styles.recHeader}>
                <View style={styles.recTitleRow}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(rec.priority) }
                  ]}>
                    <Text style={styles.priorityText}>
                      {rec.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(rec.status) }
                ]}>
                  <Text style={styles.statusText}>{getStatusLabel(rec.status)}</Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.recDescription}>{rec.description}</Text>

              {/* Impact & Cost */}
              <View style={styles.recMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Impact</Text>
                  <Text style={styles.metricValue}>{rec.impact}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Cost Impact</Text>
                  <Text style={[
                    styles.metricValue,
                    { color: rec.cost < 0 ? '#27ae60' : '#e74c3c' }
                  ]}>
                    {rec.cost < 0 ? '-' : '+'} ${Math.abs(rec.cost).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Due Date</Text>
                  <Text style={styles.metricValue}>
                    {new Date(rec.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Progress Bar (if in progress) */}
              {rec.status === 'in_progress' && rec.progress && (
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${rec.progress}%` }]}
                    />
                  </View>
                  <Text style={styles.progressText}>{rec.progress}% Complete</Text>
                </View>
              )}

              {/* Actions */}
              <View style={styles.recActions}>
                {rec.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#3498db' }]}
                    onPress={() => updateStatus(rec.id, 'in_progress')}
                  >
                    <Text style={styles.actionButtonText}>Start</Text>
                  </TouchableOpacity>
                )}
                
                {rec.status === 'in_progress' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#27ae60' }]}
                    onPress={() => updateStatus(rec.id, 'completed')}
                  >
                    <Text style={styles.actionButtonText}>Complete</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#95a5a6' }]}
                  onPress={() => navigation.navigate('ImpactDetails', { scenario: rec })}
                >
                  <Text style={styles.actionButtonText}>Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
                  onPress={() => deleteRecommendation(rec.id)}
                >
                  <Text style={styles.actionButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

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
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationCard: {
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
  recHeader: {
    marginBottom: 10,
  },
  recTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  recDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  recMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'right',
  },
  recActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ActionPlan;
