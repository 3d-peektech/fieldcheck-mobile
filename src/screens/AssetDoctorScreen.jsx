import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AssetDoctorScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // all, critical, warning, healthy

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [assetHealth, setAssetHealth] = useState([
    {
      id: 1,
      assetId: 'PUMP-A-142',
      name: 'Hydraulic Pump A-142',
      location: 'Building A - Floor 2',
      status: 'critical',
      healthScore: 34,
      aiDiagnosis: 'Bearing wear detected',
      symptoms: [
        'Elevated vibration levels (+45% from baseline)',
        'Temperature increase detected (12°C above normal)',
        'Unusual acoustic signature identified',
      ],
      predictions: {
        failureRisk: 87,
        timeToFailure: '7-14 days',
        confidence: 92,
      },
      recommendations: [
        {
          action: 'Schedule immediate inspection',
          priority: 'URGENT',
          impact: 'Prevent catastrophic failure',
          cost: '$450',
          timeframe: 'Within 48 hours',
        },
        {
          action: 'Replace bearing assembly',
          priority: 'HIGH',
          impact: 'Restore normal operation',
          cost: '$2,800',
          timeframe: 'Within 7 days',
        },
      ],
      dataSources: [
        'Vibration sensors (Real-time)',
        'Temperature monitoring',
        'Acoustic analysis',
        'Historical maintenance records',
      ],
      lastInspection: '45 days ago',
      nextScheduled: 'Overdue',
      trend: 'deteriorating',
    },
    {
      id: 2,
      assetId: 'MOTOR-B-456',
      name: 'Electric Motor B-456',
      location: 'Building B - Floor 1',
      status: 'warning',
      healthScore: 68,
      aiDiagnosis: 'Early signs of winding insulation degradation',
      symptoms: [
        'Slight increase in operating temperature (+5°C)',
        'Minor current fluctuations detected',
        'Efficiency drop of 3% over 30 days',
      ],
      predictions: {
        failureRisk: 42,
        timeToFailure: '30-60 days',
        confidence: 78,
      },
      recommendations: [
        {
          action: 'Thermal imaging inspection',
          priority: 'MEDIUM',
          impact: 'Identify hot spots early',
          cost: '$280',
          timeframe: 'Within 2 weeks',
        },
        {
          action: 'Insulation resistance test',
          priority: 'MEDIUM',
          impact: 'Assess winding condition',
          cost: '$180',
          timeframe: 'Within 3 weeks',
        },
      ],
      dataSources: [
        'Temperature sensors',
        'Current monitoring',
        'Efficiency calculations',
        'Thermal cameras (scheduled)',
      ],
      lastInspection: '28 days ago',
      nextScheduled: 'In 32 days',
      trend: 'stable',
    },
    {
      id: 3,
      assetId: 'COMP-C-789',
      name: 'Air Compressor C-789',
      location: 'Building C - Ground Floor',
      status: 'healthy',
      healthScore: 92,
      aiDiagnosis: 'Operating within normal parameters',
      symptoms: [
        'All metrics within expected ranges',
        'Consistent performance',
        'No anomalies detected',
      ],
      predictions: {
        failureRisk: 12,
        timeToFailure: '120+ days',
        confidence: 85,
      },
      recommendations: [
        {
          action: 'Continue routine monitoring',
          priority: 'LOW',
          impact: 'Maintain optimal condition',
          cost: '$0',
          timeframe: 'Ongoing',
        },
      ],
      dataSources: [
        'Pressure sensors',
        'Vibration monitoring',
        'Performance metrics',
        'Maintenance logs',
      ],
      lastInspection: '15 days ago',
      nextScheduled: 'In 45 days',
      trend: 'stable',
    },
    {
      id: 4,
      assetId: 'HVAC-D-234',
      name: 'HVAC Unit D-234',
      location: 'Building D - Roof',
      status: 'warning',
      healthScore: 71,
      aiDiagnosis: 'Refrigerant leak suspected',
      symptoms: [
        'Cooling efficiency decreased by 8%',
        'Compressor runtime increased (+15%)',
        'Unusual pressure readings',
      ],
      predictions: {
        failureRisk: 38,
        timeToFailure: '45-90 days',
        confidence: 81,
      },
      recommendations: [
        {
          action: 'Refrigerant leak detection',
          priority: 'MEDIUM',
          impact: 'Prevent further efficiency loss',
          cost: '$350',
          timeframe: 'Within 2 weeks',
        },
      ],
      dataSources: [
        'Pressure sensors',
        'Temperature monitoring',
        'Energy consumption data',
        'Performance tracking',
      ],
      lastInspection: '22 days ago',
      nextScheduled: 'In 38 days',
      trend: 'deteriorating',
    },
    {
      id: 5,
      assetId: 'CONV-E-567',
      name: 'Conveyor Belt E-567',
      location: 'Building E - Production Line',
      status: 'critical',
      healthScore: 41,
      aiDiagnosis: 'Belt misalignment and wear',
      symptoms: [
        'Tracking deviation detected (8mm off-center)',
        'Excessive belt wear on edges',
        'Increased power consumption (+18%)',
      ],
      predictions: {
        failureRisk: 79,
        timeToFailure: '10-21 days',
        confidence: 88,
      },
      recommendations: [
        {
          action: 'Belt alignment adjustment',
          priority: 'URGENT',
          impact: 'Prevent belt failure',
          cost: '$520',
          timeframe: 'Within 3 days',
        },
        {
          action: 'Replace worn belt section',
          priority: 'HIGH',
          impact: 'Restore efficiency',
          cost: '$1,650',
          timeframe: 'Within 14 days',
        },
      ],
      dataSources: [
        'Vision system tracking',
        'Power monitoring',
        'Belt wear sensors',
        'Maintenance history',
      ],
      lastInspection: '38 days ago',
      nextScheduled: 'Overdue',
      trend: 'deteriorating',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const filteredAssets = assetHealth.filter(asset => {
    if (filter === 'all') return true;
    return asset.status === filter;
  });

  const statusCounts = {
    critical: assetHealth.filter(a => a.status === 'critical').length,
    warning: assetHealth.filter(a => a.status === 'warning').length,
    healthy: assetHealth.filter(a => a.status === 'healthy').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return ['#ef4444', '#dc2626'];
      case 'warning': return ['#f59e0b', '#d97706'];
      case 'healthy': return ['#10b981', '#059669'];
      default: return ['#64748b', '#475569'];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'healthy': return '✅';
      default: return '◉';
    }
  };

  const openAssetDetails = (asset) => {
    setSelectedAsset(asset);
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Asset Doctor</Text>
            <Text style={styles.headerSubtitle}>AI Health Monitoring</Text>
          </View>
          <View style={styles.dataBadge}>
            <Text style={styles.dataBadgeText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.dateText}>{currentDate}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Health Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Fleet Health Overview</Text>
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={[styles.statBox, filter === 'critical' && styles.statBoxActive]}
              onPress={() => setFilter(filter === 'critical' ? 'all' : 'critical')}
            >
              <Text style={styles.statValue}>{statusCounts.critical}</Text>
              <Text style={styles.statLabel}>Critical</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#ef4444' }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statBox, filter === 'warning' && styles.statBoxActive]}
              onPress={() => setFilter(filter === 'warning' ? 'all' : 'warning')}
            >
              <Text style={styles.statValue}>{statusCounts.warning}</Text>
              <Text style={styles.statLabel}>Warning</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#f59e0b' }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statBox, filter === 'healthy' && styles.statBoxActive]}
              onPress={() => setFilter(filter === 'healthy' ? 'all' : 'healthy')}
            >
              <Text style={styles.statValue}>{statusCounts.healthy}</Text>
              <Text style={styles.statLabel}>Healthy</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#10b981' }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Insights Banner */}
        <View style={styles.insightBanner}>
          <Text style={styles.insightIcon}>🤖</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>AI Analysis</Text>
            <Text style={styles.insightText}>
              2 assets require immediate attention • 5 monitored in real-time
            </Text>
          </View>
        </View>

        {/* Asset Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filter === 'all' ? 'All Assets' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Assets`}
          </Text>
          <Text style={styles.sectionCount}>({filteredAssets.length})</Text>
        </View>

        {filteredAssets.map((asset) => (
          <TouchableOpacity
            key={asset.id}
            style={styles.assetCard}
            onPress={() => openAssetDetails(asset)}
          >
            <View style={styles.assetHeader}>
              <View style={styles.assetTitleRow}>
                <Text style={styles.assetStatus}>{getStatusIcon(asset.status)}</Text>
                <View style={styles.assetTitles}>
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <Text style={styles.assetId}>{asset.assetId}</Text>
                </View>
              </View>
              <View style={styles.healthScoreContainer}>
                <Text style={styles.healthScoreValue}>{asset.healthScore}</Text>
                <Text style={styles.healthScoreLabel}>Health</Text>
              </View>
            </View>

            <Text style={styles.assetLocation}>📍 {asset.location}</Text>

            <View style={styles.diagnosisBox}>
              <Text style={styles.diagnosisLabel}>AI Diagnosis</Text>
              <Text style={styles.diagnosisText}>{asset.aiDiagnosis}</Text>
            </View>

            <View style={styles.predictionRow}>
              <View style={styles.predictionItem}>
                <Text style={styles.predictionLabel}>Failure Risk</Text>
                <View style={styles.riskBar}>
                  <View
                    style={[
                      styles.riskBarFill,
                      {
                        width: `${asset.predictions.failureRisk}%`,
                        backgroundColor:
                          asset.predictions.failureRisk > 70
                            ? '#ef4444'
                            : asset.predictions.failureRisk > 40
                            ? '#f59e0b'
                            : '#10b981',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.predictionValue}>
                  {asset.predictions.failureRisk}%
                </Text>
              </View>

              <View style={styles.predictionItem}>
                <Text style={styles.predictionLabel}>Time to Failure</Text>
                <Text style={styles.timeframeValue}>
                  {asset.predictions.timeToFailure}
                </Text>
              </View>
            </View>

            <View style={styles.assetFooter}>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  {asset.predictions.confidence}% Confidence
                </Text>
              </View>
              <Text style={styles.viewDetailsText}>Tap for details →</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Asset Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedAsset && (
                <>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalTitle}>{selectedAsset.name}</Text>
                      <Text style={styles.modalSubtitle}>{selectedAsset.assetId}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <LinearGradient
                    colors={getStatusColor(selectedAsset.status)}
                    style={styles.modalHealthCard}
                  >
                    <Text style={styles.modalHealthScore}>
                      {selectedAsset.healthScore}
                    </Text>
                    <Text style={styles.modalHealthLabel}>Health Score</Text>
                    <Text style={styles.modalHealthStatus}>
                      {selectedAsset.status.toUpperCase()}
                    </Text>
                  </LinearGradient>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>🔍 Symptoms Detected</Text>
                    {selectedAsset.symptoms.map((symptom, index) => (
                      <View key={index} style={styles.symptomItem}>
                        <Text style={styles.symptomBullet}>•</Text>
                        <Text style={styles.symptomText}>{symptom}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>💡 Recommendations</Text>
                    {selectedAsset.recommendations.map((rec, index) => (
                      <View key={index} style={styles.recommendationCard}>
                        <View style={styles.recHeader}>
                          <Text style={styles.recAction}>{rec.action}</Text>
                          <View
                            style={[
                              styles.priorityBadge,
                              {
                                backgroundColor:
                                  rec.priority === 'URGENT'
                                    ? '#fee2e2'
                                    : rec.priority === 'HIGH'
                                    ? '#ffedd5'
                                    : rec.priority === 'MEDIUM'
                                    ? '#fef3c7'
                                    : '#f0fdf4',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.priorityText,
                                {
                                  color:
                                    rec.priority === 'URGENT'
                                      ? '#991b1b'
                                      : rec.priority === 'HIGH'
                                      ? '#9a3412'
                                      : rec.priority === 'MEDIUM'
                                      ? '#854d0e'
                                      : '#166534',
                                },
                              ]}
                            >
                              {rec.priority}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.recImpact}>{rec.impact}</Text>
                        <View style={styles.recDetails}>
                          <Text style={styles.recDetailText}>💰 {rec.cost}</Text>
                          <Text style={styles.recDetailText}>⏱️ {rec.timeframe}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>📊 Data Sources</Text>
                    {selectedAsset.dataSources.map((source, index) => (
                      <View key={index} style={styles.dataSourceItem}>
                        <Text style={styles.dataSourceDot}>◉</Text>
                        <Text style={styles.dataSourceText}>{source}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>📅 Inspection History</Text>
                    <View style={styles.inspectionRow}>
                      <Text style={styles.inspectionLabel}>Last Inspection:</Text>
                      <Text style={styles.inspectionValue}>
                        {selectedAsset.lastInspection}
                      </Text>
                    </View>
                    <View style={styles.inspectionRow}>
                      <Text style={styles.inspectionLabel}>Next Scheduled:</Text>
                      <Text
                        style={[
                          styles.inspectionValue,
                          selectedAsset.nextScheduled === 'Overdue' &&
                            styles.overdueText,
                        ]}
                      >
                        {selectedAsset.nextScheduled}
                      </Text>
                    </View>
                  </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  dataBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dataBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  dateText: {
    fontSize: 13,
    color: '#94c5f8',
  },
  content: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  statBoxActive: {
    backgroundColor: '#e0f2fe',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  statIndicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  insightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  insightIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 13,
    color: '#1e40af',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  sectionCount: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 8,
  },
  assetCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assetStatus: {
    fontSize: 24,
    marginRight: 12,
  },
  assetTitles: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  assetId: {
    fontSize: 12,
    color: '#64748b',
  },
  healthScoreContainer: {
    alignItems: 'center',
  },
  healthScoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
  },
  healthScoreLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  assetLocation: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  diagnosisBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  diagnosisLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#854d0e',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 14,
    color: '#713f12',
    fontWeight: '600',
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  predictionItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  predictionLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  riskBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  predictionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  timeframeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 10,
  },
  assetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e40af',
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '600',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
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
  modalHealthCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHealthScore: {
    fontSize: 56,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  modalHealthLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  modalHealthStatus: {
    fontSize: 16,
    fontWeight: '700',
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
  symptomItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  symptomBullet: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
    fontWeight: '700',
  },
  symptomText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recAction: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  recImpact: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  recDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recDetailText: {
    fontSize: 12,
    color: '#64748b',
  },
  dataSourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataSourceDot: {
    fontSize: 12,
    color: '#3b82f6',
    marginRight: 8,
  },
  dataSourceText: {
    fontSize: 14,
    color: '#64748b',
  },
  inspectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inspectionLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  inspectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  overdueText: {
    color: '#ef4444',
  },
});

export default AssetDoctorScreen;
