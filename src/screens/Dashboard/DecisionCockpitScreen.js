// DecisionCockpitScreen.js
// Main Dashboard - "What Changed Today"
// Location: src/screens/Dashboard/DecisionCockpitScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function DecisionCockpitScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Simulated real-time data
  const [dashboardData, setDashboardData] = useState({
    lastUpdate: new Date(),
    criticalAlerts: 3,
    pendingDecisions: 5,
    financialExposure: 156000,
    assetsMonitored: 127,
    dataQuality: 94,
  });

  const [topRisks, setTopRisks] = useState([
    {
      id: '1',
      title: 'Compressor Unit #3',
      risk: 'High',
      probability: 87,
      impact: '$42,000',
      timeframe: '14 days',
      confidence: 91,
      signal: 'Vibration anomaly detected',
      color: '#EF4444',
    },
    {
      id: '2',
      title: 'Cooling System B',
      risk: 'Medium',
      probability: 64,
      impact: '$18,500',
      timeframe: '30 days',
      confidence: 78,
      signal: 'Temperature trending up',
      color: '#F59E0B',
    },
    {
      id: '3',
      title: 'Hydraulic Pump #7',
      risk: 'Medium',
      probability: 58,
      impact: '$12,300',
      timeframe: '21 days',
      confidence: 82,
      signal: 'Pressure fluctuations',
      color: '#F59E0B',
    },
  ]);

  const [whatChangedToday, setWhatChangedToday] = useState([
    {
      id: '1',
      type: 'anomaly',
      title: 'New Anomaly Detected',
      asset: 'Motor Controller #12',
      description: 'Current draw increased 23% over baseline',
      timestamp: '2 hours ago',
      severity: 'warning',
      icon: 'warning',
    },
    {
      id: '2',
      type: 'improvement',
      title: 'Performance Improvement',
      asset: 'Production Line A',
      description: 'Efficiency increased 8% after maintenance',
      timestamp: '4 hours ago',
      severity: 'success',
      icon: 'trending-up',
    },
    {
      id: '3',
      type: 'degradation',
      title: 'Degradation Trend',
      asset: 'Bearing Assembly #5',
      description: 'Gradual decline in lubrication effectiveness',
      timestamp: '6 hours ago',
      severity: 'info',
      icon: 'analytics',
    },
  ]);

  const [aiStatus, setAiStatus] = useState({
    active: true,
    message: 'AI engine running normally',
    dataCoverage: 94,
    lastModelUpdate: '2 hours ago',
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      const language = await AsyncStorage.getItem('language');
      if (darkMode) setIsDarkMode(darkMode === 'true');
      if (language) setCurrentLanguage(language);
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDashboardData({
      ...dashboardData,
      lastUpdate: new Date(),
    });
    setRefreshing(false);
  };

  const colors = isDarkMode ? {
    background: '#0A0E12',
    card: '#1A1F26',
    cardBorder: '#2A2F36',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    primary: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  } : {
    background: '#F3F4F6',
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    primary: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  };

  const StatCard = ({ icon, label, value, trend, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      {trend && (
        <View style={styles.statTrend}>
          <Ionicons 
            name={trend > 0 ? 'arrow-up' : 'arrow-down'} 
            size={12} 
            color={trend > 0 ? colors.success : colors.danger} 
          />
          <Text style={[styles.statTrendText, { color: trend > 0 ? colors.success : colors.danger }]}>
            {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </View>
  );

  const RiskCard = ({ risk }) => (
    <TouchableOpacity
      style={[styles.riskCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={() => navigation.navigate('AssetDetail', { assetId: risk.id })}
      activeOpacity={0.8}
    >
      <View style={styles.riskHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.riskTitleRow}>
            <View style={[styles.riskIndicator, { backgroundColor: risk.color }]} />
            <Text style={[styles.riskTitle, { color: colors.text }]}>{risk.title}</Text>
          </View>
          <Text style={[styles.riskSignal, { color: colors.textSecondary }]}>
            {risk.signal}
          </Text>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: `${risk.color}15` }]}>
          <Text style={[styles.riskBadgeText, { color: risk.color }]}>
            {risk.probability}%
          </Text>
        </View>
      </View>

      <View style={styles.riskMetrics}>
        <View style={styles.riskMetric}>
          <Text style={[styles.riskMetricLabel, { color: colors.textSecondary }]}>
            Financial Impact
          </Text>
          <Text style={[styles.riskMetricValue, { color: colors.text }]}>
            {risk.impact}
          </Text>
        </View>
        <View style={styles.riskMetric}>
          <Text style={[styles.riskMetricLabel, { color: colors.textSecondary }]}>
            Timeframe
          </Text>
          <Text style={[styles.riskMetricValue, { color: colors.text }]}>
            {risk.timeframe}
          </Text>
        </View>
        <View style={styles.riskMetric}>
          <Text style={[styles.riskMetricLabel, { color: colors.textSecondary }]}>
            Confidence
          </Text>
          <Text style={[styles.riskMetricValue, { color: colors.success }]}>
            {risk.confidence}%
          </Text>
        </View>
      </View>

      <View style={styles.riskFooter}>
        <Text style={[styles.riskAction, { color: colors.primary }]}>
          View Recommendations
        </Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const ChangeCard = ({ change }) => {
    const getSeverityColor = (severity) => {
      switch (severity) {
        case 'warning': return colors.warning;
        case 'success': return colors.success;
        case 'danger': return colors.danger;
        default: return colors.info;
      }
    };

    return (
      <TouchableOpacity
        style={[styles.changeCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        activeOpacity={0.8}
      >
        <View style={[styles.changeIcon, { backgroundColor: `${getSeverityColor(change.severity)}15` }]}>
          <Ionicons name={change.icon} size={24} color={getSeverityColor(change.severity)} />
        </View>
        <View style={styles.changeContent}>
          <Text style={[styles.changeTitle, { color: colors.text }]}>
            {change.title}
          </Text>
          <Text style={[styles.changeAsset, { color: colors.primary }]}>
            {change.asset}
          </Text>
          <Text style={[styles.changeDescription, { color: colors.textSecondary }]}>
            {change.description}
          </Text>
          <Text style={[styles.changeTime, { color: colors.textSecondary }]}>
            {change.timestamp}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Decision Cockpit</Text>
            <Text style={styles.headerSubtitle}>
              Live Intelligence • {new Date().toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            {dashboardData.criticalAlerts > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {dashboardData.criticalAlerts}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{dashboardData.pendingDecisions}</Text>
            <Text style={styles.quickStatLabel}>Pending</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>
              ${(dashboardData.financialExposure / 1000).toFixed(0)}k
            </Text>
            <Text style={styles.quickStatLabel}>Exposure</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{dashboardData.assetsMonitored}</Text>
            <Text style={styles.quickStatLabel}>Assets</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* AI Status Banner */}
        <View style={[styles.aiStatusBanner, { 
          backgroundColor: aiStatus.active ? `${colors.success}15` : `${colors.warning}15`,
          borderColor: aiStatus.active ? colors.success : colors.warning
        }]}>
          <View style={[styles.aiStatusDot, { 
            backgroundColor: aiStatus.active ? colors.success : colors.warning 
          }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.aiStatusText, { 
              color: aiStatus.active ? colors.success : colors.warning 
            }]}>
              {aiStatus.message}
            </Text>
            <Text style={[styles.aiStatusSubtext, { color: colors.textSecondary }]}>
              {aiStatus.dataCoverage}% data coverage • Updated {aiStatus.lastModelUpdate}
            </Text>
          </View>
        </View>

        {/* What Changed Today */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What Changed Today
            </Text>
            <TouchableOpacity>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {whatChangedToday.map((change) => (
            <ChangeCard key={change.id} change={change} />
          ))}
        </View>

        {/* Top Risks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Top Risks
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('FinancialAI')}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>
                Financial View →
              </Text>
            </TouchableOpacity>
          </View>
          {topRisks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            System Health
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="pulse"
              label="AI Confidence"
              value="94%"
              trend={2}
              color={colors.success}
            />
            <StatCard
              icon="shield-checkmark"
              label="Uptime"
              value="99.8%"
              trend={0}
              color={colors.primary}
            />
            <StatCard
              icon="speedometer"
              label="Response Time"
              value="12ms"
              trend={-8}
              color={colors.info}
            />
            <StatCard
              icon="analytics"
              label="Predictions"
              value="847"
              trend={15}
              color={colors.warning}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
  },
  aiStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  aiStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  aiStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiStatusSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  changeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeContent: {
    flex: 1,
  },
  changeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  changeAsset: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  changeDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  changeTime: {
    fontSize: 11,
  },
  riskCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  riskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  riskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  riskSignal: {
    fontSize: 13,
    marginLeft: 16,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  riskMetrics: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  riskMetric: {
    flex: 1,
  },
  riskMetricLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  riskMetricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  riskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 4,
  },
  riskAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    margin: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  statTrendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
