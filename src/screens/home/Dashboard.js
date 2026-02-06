import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import aiAPI from '../../api/ai';
import { assetsAPI } from '../../api/assets';
import { inspectionsAPI } from '../../api/inspections';

const { width, height } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  // State Management
  const [userName, setUserName] = useState('Aimar Garcia');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeAssets: 0,
    maintenanceAssets: 0,
    criticalAlerts: 0,
    pendingInspections: 0,
    completedToday: 0,
    efficiency: 0,
    costSavings: 0,
  });
  const [aiInsights, setAiInsights] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [predictiveAlerts, setPredictiveAlerts] = useState([]);
  const [trendingIssues, setTrendingIssues] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    mtbf: 0,
    mttr: 0,
    availability: 0,
    reliability: 0,
  });
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadDashboardData();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const [
        statsResponse,
        insightsResponse,
        alertsResponse,
        activityResponse,
        metricsResponse,
        recommendationsResponse,
        issuesResponse,
      ] = await Promise.allSettled([
        aiAPI.getDashboardStats(),
        aiAPI.getInsights(),
        aiAPI.getPredictiveAlerts(),
        aiAPI.getRecentActivity(),
        aiAPI.getPerformanceMetrics(),
        aiAPI.getRecommendations(),
        aiAPI.getTrendingIssues(),
      ]);

      if (statsResponse.status === 'fulfilled' && statsResponse.value?.success) {
        setStats(statsResponse.value.stats);
      } else {
        setStats({
          totalAssets: 247,
          activeAssets: 218,
          maintenanceAssets: 23,
          criticalAlerts: 5,
          pendingInspections: 12,
          completedToday: 8,
          efficiency: 87.5,
          costSavings: 45230,
        });
      }

      if (insightsResponse.status === 'fulfilled' && insightsResponse.value?.success) {
        setAiInsights(insightsResponse.value.insights);
      } else {
        setAiInsights([
          {
            id: 1,
            type: 'warning',
            title: 'Predictive Maintenance Alert',
            description: 'Asset #A-2847 shows 78% probability of failure within 30 days',
            details: 'Based on vibration analysis, temperature trends, and historical failure patterns, this compressor is showing early warning signs of bearing degradation.',
            priority: 'high',
            confidence: 78,
            affectedAssets: 1,
            estimatedCost: 8500,
            recommendedAction: 'Schedule preventive maintenance within 7 days',
            impactLevel: 'critical',
          },
          {
            id: 2,
            type: 'success',
            title: 'Efficiency Improvement Detected',
            description: 'Inspection time reduced by 23% using AI-assisted workflows',
            details: 'Machine learning models have optimized inspection routes and automated defect detection, saving an average of 15 minutes per inspection.',
            priority: 'medium',
            confidence: 95,
            affectedAssets: 156,
            estimatedCost: -12300,
            recommendedAction: 'Continue current workflow',
            impactLevel: 'positive',
          },
          {
            id: 3,
            type: 'info',
            title: 'Pattern Detected: Corrosion Cluster',
            description: 'Similar defects found in 5 assets. Bulk inspection recommended',
            details: 'AI has identified a common corrosion pattern in 5 outdoor electrical cabinets. Environmental factors and age correlation suggest preventive action.',
            priority: 'medium',
            confidence: 89,
            affectedAssets: 5,
            estimatedCost: 3200,
            recommendedAction: 'Conduct group inspection and apply protective coating',
            impactLevel: 'moderate',
          },
        ]);
      }

      if (alertsResponse.status === 'fulfilled' && alertsResponse.value?.success) {
        setPredictiveAlerts(alertsResponse.value.alerts);
      } else {
        setPredictiveAlerts([
          { 
            id: 1, 
            message: '3 assets need inspection this week', 
            severity: 'medium',
            assetIds: ['A-145', 'B-092', 'C-234'],
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { 
            id: 2, 
            message: '2 critical maintenance overdue', 
            severity: 'high',
            assetIds: ['D-456', 'E-789'],
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);
      }

      if (activityResponse.status === 'fulfilled' && activityResponse.value?.success) {
        setRecentActivity(activityResponse.value.activities);
      } else {
        setRecentActivity([
          { 
            id: 1, 
            action: 'AI-Assisted Inspection completed', 
            asset: 'Pump #A-142', 
            time: '15 min ago',
            confidence: 94,
            issuesFound: 0,
          },
          { 
            id: 2, 
            action: 'Critical defect detected', 
            asset: 'Motor #B-89', 
            time: '1 hour ago',
            confidence: 87,
            issuesFound: 2,
          },
        ]);
      }

      if (metricsResponse.status === 'fulfilled' && metricsResponse.value?.success) {
        setPerformanceMetrics(metricsResponse.value.metrics);
      } else {
        setPerformanceMetrics({
          mtbf: 2847,
          mttr: 4.2,
          availability: 98.5,
          reliability: 96.8,
        });
      }

      if (recommendationsResponse.status === 'fulfilled' && recommendationsResponse.value?.success) {
        setAiRecommendations(recommendationsResponse.value.recommendations);
      } else {
        setAiRecommendations([
          {
            id: 1,
            title: 'Optimize Inspection Routes',
            description: 'AI suggests new route planning to reduce travel time by 25%',
            impact: 'high',
            effort: 'low',
            savings: 12500,
          },
          {
            id: 2,
            title: 'Implement Condition-Based Maintenance',
            description: 'Switch from time-based to condition-based for 12 critical assets',
            impact: 'high',
            effort: 'medium',
            savings: 34000,
          },
        ]);
      }

      if (issuesResponse.status === 'fulfilled' && issuesResponse.value?.success) {
        setTrendingIssues(issuesResponse.value.issues);
      } else {
        setTrendingIssues([
          { type: 'Bearing Wear', count: 7, trend: 'up' },
          { type: 'Corrosion', count: 5, trend: 'stable' },
          { type: 'Overheating', count: 3, trend: 'down' },
        ]);
      }

      setRefreshing(false);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setRefreshing(false);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  const handleAIInsightPress = (insight) => {
    setSelectedInsight(insight);
    setShowInsightModal(true);
  };

  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'scan':
        navigation.navigate('ScanAsset');
        break;
      case 'ai':
        navigation.navigate('AIAnalysis');
        break;
      case 'inspection':
        navigation.navigate('NewInspection');
        break;
      case 'asset':
        navigation.navigate('AddAsset');
        break;
      case 'aiDoctor':
        navigation.navigate('SmartAssetDoctor');
        break;
      case 'voiceInspector':
        navigation.navigate('VoiceInspector');
        break;
      case 'financialPredictor':
        navigation.navigate('FinancialPredictor');
        break;
      default:
        break;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
      case 'alert':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      case 'optimization':
        return '⚡';
      default:
        return '📊';
    }
  };

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `$${(absAmount / 1000000).toFixed(1)}M`;
    } else if (absAmount >= 1000) {
      return `$${(absAmount / 1000).toFixed(1)}K`;
    }
    return `$${absAmount}`;
  };

  const renderInsightModal = () => (
    <Modal
      visible={showInsightModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowInsightModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>{getInsightIcon(selectedInsight?.type)}</Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowInsightModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>{selectedInsight?.title}</Text>
          
          <View style={styles.modalBadges}>
            <View style={[styles.modalBadge, { backgroundColor: getPriorityColor(selectedInsight?.priority) }]}>
              <Text style={styles.modalBadgeText}>{selectedInsight?.priority?.toUpperCase()}</Text>
            </View>
            <View style={styles.modalBadge}>
              <Text style={styles.modalBadgeText}>
                {selectedInsight?.confidence}% Confidence
              </Text>
            </View>
          </View>

          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalSectionTitle}>Description</Text>
            <Text style={styles.modalDescription}>{selectedInsight?.description}</Text>

            <Text style={styles.modalSectionTitle}>Detailed Analysis</Text>
            <Text style={styles.modalDescription}>{selectedInsight?.details}</Text>

            <Text style={styles.modalSectionTitle}>Impact Assessment</Text>
            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>Affected Assets</Text>
                <Text style={styles.modalStatValue}>{selectedInsight?.affectedAssets}</Text>
              </View>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>Financial Impact</Text>
                <Text style={[
                  styles.modalStatValue,
                  { color: selectedInsight?.estimatedCost < 0 ? '#27ae60' : '#e74c3c' }
                ]}>
                  {selectedInsight?.estimatedCost < 0 ? '+' : ''}
                  {formatCurrency(selectedInsight?.estimatedCost)}
                </Text>
              </View>
            </View>

            <Text style={styles.modalSectionTitle}>Recommended Action</Text>
            <View style={styles.modalActionBox}>
              <Text style={styles.modalActionText}>{selectedInsight?.recommendedAction}</Text>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => setShowInsightModal(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => {
                setShowInsightModal(false);
                navigation.navigate('AIAnalysis');
              }}
            >
              <Text style={styles.modalButtonTextPrimary}>Take Action</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a252f" />

      <LinearGradient
        colors={['#1a252f', '#2c3e50']}
        style={styles.header}
      >
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.subtitle}>AI-Powered Asset Management</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Alert.alert('Notifications', `${predictiveAlerts.length} new alerts`)}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          {predictiveAlerts.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{predictiveAlerts.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        opacity={fadeAnim}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3498db"
            colors={['#3498db']}
          />
        }
      >
        {/* Key Performance Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Key Metrics</Text>
          <View style={styles.kpiGrid}>
            <View style={[styles.kpiCard, { backgroundColor: '#3498db' }]}>
              <Text style={styles.kpiValue}>{stats.efficiency}%</Text>
              <Text style={styles.kpiLabel}>AI Efficiency</Text>
              <Text style={styles.kpiTrend}>↑ 12%</Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: '#27ae60' }]}>
              <Text style={styles.kpiValue}>{formatCurrency(stats.costSavings)}</Text>
              <Text style={styles.kpiLabel}>Cost Saved</Text>
              <Text style={styles.kpiTrend}>↑ 23%</Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: '#e74c3c' }]}>
              <Text style={styles.kpiValue}>{stats.criticalAlerts}</Text>
              <Text style={styles.kpiLabel}>Critical Alerts</Text>
              <Text style={styles.kpiTrend}>↓ 5%</Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: '#9b59b6' }]}>
              <Text style={styles.kpiValue}>{performanceMetrics.availability}%</Text>
              <Text style={styles.kpiLabel}>Availability</Text>
              <Text style={styles.kpiTrend}>↑ 3%</Text>
            </View>
          </View>
        </View>

        {/* AI Insights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤖 AI Insights</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AIAnalysis')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {aiInsights.map((insight) => (
              <TouchableOpacity
                key={insight.id}
                style={[
                  styles.insightCard,
                  { borderLeftColor: getPriorityColor(insight.priority) }
                ]}
                onPress={() => handleAIInsightPress(insight)}
                activeOpacity={0.9}
              >
                <View style={styles.insightHeader}>
                  <Text style={styles.insightIcon}>{getInsightIcon(insight.type)}</Text>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{insight.confidence}%</Text>
                  </View>
                </View>
                <Text style={styles.insightTitle} numberOfLines={2}>{insight.title}</Text>
                <Text style={styles.insightDescription} numberOfLines={2}>
                  {insight.description}
                </Text>
                
                <View style={styles.insightMetrics}>
                  <View style={styles.insightMetric}>
                    <Text style={styles.insightMetricLabel}>Assets</Text>
                    <Text style={styles.insightMetricValue}>{insight.affectedAssets}</Text>
                  </View>
                  <View style={styles.insightMetric}>
                    <Text style={styles.insightMetricLabel}>Impact</Text>
                    <Text style={[
                      styles.insightMetricValue,
                      { color: insight.estimatedCost < 0 ? '#27ae60' : '#e74c3c' }
                    ]}>
                      {formatCurrency(insight.estimatedCost)}
                    </Text>
                  </View>
                </View>

                <View style={styles.insightFooter}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(insight.priority) }]}>
                    <Text style={styles.priorityText}>{insight.priority.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.insightAction}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ============================================ */}
        {/* QUICK ACTIONS - AQUÍ VAN LOS BOTONES AI */}
        {/* ============================================ */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithBadge}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
            <View style={styles.newFeatureBadge}>
              <Text style={styles.newFeatureBadgeText}>NEW AI TOOLS</Text>
            </View>
          </View>
          <View style={styles.quickActionsGrid}>
            
            {/* BOTONES EXISTENTES */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#3498db' }]}
              onPress={() => handleQuickAction('scan')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>📱</Text>
              </View>
              <Text style={styles.actionText}>Scan Asset</Text>
              <Text style={styles.actionSubtext}>QR/Barcode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#9b59b6' }]}
              onPress={() => handleQuickAction('ai')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>✨</Text>
              </View>
              <Text style={styles.actionText}>AI Analysis</Text>
              <Text style={styles.actionSubtext}>Smart Detect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#27ae60' }]}
              onPress={() => handleQuickAction('inspection')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>📋</Text>
              </View>
              <Text style={styles.actionText}>New Inspection</Text>
              <Text style={styles.actionSubtext}>Quick Start</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#e67e22' }]}
              onPress={() => handleQuickAction('asset')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>➕</Text>
              </View>
              <Text style={styles.actionText}>Add Asset</Text>
              <Text style={styles.actionSubtext}>Register New</Text>
            </TouchableOpacity>

            {/* ============================================ */}
            {/* NUEVOS BOTONES AI - PEGA AQUÍ */}
            {/* ============================================ */}
            
            {/* NUEVO: AI Doctor */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#8b5cf6' }]}
              onPress={() => handleQuickAction('aiDoctor')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>🔬</Text>
              </View>
              <Text style={styles.actionText}>AI Doctor</Text>
              <Text style={styles.actionSubtext}>Visual Diagnosis</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </TouchableOpacity>

            {/* NUEVO: Voice Inspector */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#3b82f6' }]}
              onPress={() => handleQuickAction('voiceInspector')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>🎤</Text>
              </View>
              <Text style={styles.actionText}>Voice Inspector</Text>
              <Text style={styles.actionSubtext}>Speak to Report</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>NEW</Text>
              </View>
            </TouchableOpacity>

            {/* NUEVO: Financial AI */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#10b981' }]}
              onPress={() => handleQuickAction('financialPredictor')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>💰</Text>
              </View>
              <Text style={styles.actionText}>Financial AI</Text>
              <Text style={styles.actionSubtext}>ROI Predictor</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>PRO</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* Performance Metrics Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{performanceMetrics.mtbf}</Text>
              <Text style={styles.metricLabel}>MTBF (hours)</Text>
              <Text style={styles.metricSubtext}>Mean Time Between Failures</Text>
              <View style={styles.metricBar}>
                <View style={[styles.metricBarFill, { width: '85%', backgroundColor: '#27ae60' }]} />
              </View>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{performanceMetrics.mttr}</Text>
              <Text style={styles.metricLabel}>MTTR (hours)</Text>
              <Text style={styles.metricSubtext}>Mean Time To Repair</Text>
              <View style={styles.metricBar}>
                <View style={[styles.metricBarFill, { width: '70%', backgroundColor: '#3498db' }]} />
              </View>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{performanceMetrics.reliability}%</Text>
              <Text style={styles.metricLabel}>Reliability</Text>
              <Text style={styles.metricSubtext}>System Reliability Score</Text>
              <View style={styles.metricBar}>
                <View style={[styles.metricBarFill, { width: '96%', backgroundColor: '#9b59b6' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Assets Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏭 Assets Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalAssets}</Text>
              <Text style={styles.statLabel}>Total Assets</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#3498db' }]} />
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.activeAssets}</Text>
              <Text style={styles.statLabel}>Active</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#27ae60' }]} />
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.maintenanceAssets}</Text>
              <Text style={styles.statLabel}>Maintenance</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#f39c12' }]} />
            </View>
          </View>
        </View>

        {/* Trending Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📉 Trending Issues</Text>
          <View style={styles.trendingContainer}>
            {trendingIssues.map((issue, index) => (
              <View key={index} style={styles.trendingItem}>
                <View style={styles.trendingLeft}>
                  <Text style={styles.trendingType}>{issue.type}</Text>
                  <Text style={styles.trendingCount}>{issue.count} occurrences</Text>
                </View>
                <View style={styles.trendingRight}>
                  <Text style={[
                    styles.trendingIcon,
                    { color: issue.trend === 'up' ? '#e74c3c' : issue.trend === 'down' ? '#27ae60' : '#95a5a6' }
                  ]}>
                    {issue.trend === 'up' ? '↗️' : issue.trend === 'down' ? '↘️' : '→'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* AI Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 AI Recommendations</Text>
          {aiRecommendations.map((rec) => (
            <TouchableOpacity key={rec.id} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
                <View style={[
                  styles.impactBadge,
                  { backgroundColor: rec.impact === 'high' ? '#27ae60' : rec.impact === 'medium' ? '#3498db' : '#95a5a6' }
                ]}>
                  <Text style={styles.impactText}>{rec.impact.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
              <View style={styles.recommendationFooter}>
                <View style={styles.recommendationMetric}>
                  <Text style={styles.recommendationMetricLabel}>Effort</Text>
                  <Text style={styles.recommendationMetricValue}>{rec.effort}</Text>
                </View>
                <View style={styles.recommendationMetric}>
                  <Text style={styles.recommendationMetricLabel}>Savings</Text>
                  <Text style={[styles.recommendationMetricValue, { color: '#27ae60' }]}>
                    {formatCurrency(rec.savings)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inspections Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Inspections Status</Text>
          <View style={styles.inspectionStatsContainer}>
            <View style={styles.inspectionStatItem}>
              <Text style={styles.inspectionStatNumber}>{stats.pendingInspections}</Text>
              <Text style={styles.inspectionStatLabel}>Pending</Text>
              <View style={styles.inspectionStatBar}>
                <View style={[styles.inspectionStatFill, { width: '60%', backgroundColor: '#e67e22' }]} />
              </View>
            </View>

            <View style={styles.inspectionStatItem}>
              <Text style={styles.inspectionStatNumber}>{stats.completedToday}</Text>
              <Text style={styles.inspectionStatLabel}>Completed Today</Text>
              <View style={styles.inspectionStatBar}>
                <View style={[styles.inspectionStatFill, { width: '80%', backgroundColor: '#27ae60' }]} />
              </View>
            </View>

            <View style={styles.inspectionStatItem}>
              <Text style={styles.inspectionStatNumber}>{stats.criticalAlerts}</Text>
              <Text style={styles.inspectionStatLabel}>Critical Alerts</Text>
              <View style={styles.inspectionStatBar}>
                <View style={[styles.inspectionStatFill, { width: '40%', backgroundColor: '#e74c3c' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Predictive Alerts */}
        {predictiveAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Predictive Alerts</Text>
            {predictiveAlerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={[
                  styles.alertCard,
                  { borderLeftColor: alert.severity === 'high' ? '#e74c3c' : alert.severity === 'medium' ? '#f39c12' : '#3498db' }
                ]}
                onPress={() => Alert.alert('Alert Details', alert.message)}
              >
                <View style={styles.alertContent}>
                  <Text style={styles.alertIcon}>
                    {alert.severity === 'high' ? '🚨' : alert.severity === 'medium' ? '⚠️' : 'ℹ️'}
                  </Text>
                  <View style={styles.alertTextContainer}>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <Text style={styles.alertSubtext}>
                      Assets: {alert.assetIds.join(', ')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Review</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🕐 Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[
                styles.activityDot,
                { backgroundColor: activity.issuesFound > 0 ? '#e74c3c' : '#27ae60' }
              ]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityAsset}>{activity.asset}</Text>
                <View style={styles.activityFooter}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <Text style={styles.activityConfidence}>
                    {activity.confidence}% confidence
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* AI-Powered Features Banner */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.aiFeaturesBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.aiFeaturesTitle}>🚀 Powered by Advanced AI</Text>
          <Text style={styles.aiFeaturesDescription}>
            Next-generation machine learning algorithms continuously analyze your assets,
            predict failures before they happen, optimize maintenance schedules, and
            provide actionable insights to reduce downtime by up to 40% and costs by 35%.
          </Text>
          <View style={styles.aiFeaturesList}>
            <Text style={styles.aiFeatureItem}>✓ Predictive Maintenance</Text>
            <Text style={styles.aiFeatureItem}>✓ Anomaly Detection</Text>
            <Text style={styles.aiFeatureItem}>✓ Pattern Recognition</Text>
            <Text style={styles.aiFeatureItem}>✓ Cost Optimization</Text>
          </View>
          <TouchableOpacity
            style={styles.aiFeaturesButton}
            onPress={() => navigation.navigate('AIAnalysis')}
          >
            <Text style={styles.aiFeaturesButtonText}>Explore AI Features →</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {renderInsightModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 4,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeaderWithBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  newFeatureBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  newFeatureBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // KPI Cards
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  kpiLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  kpiTrend: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  // AI Insights
  insightCard: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginRight: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 32,
  },
  confidenceBadge: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  insightTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 14,
  },
  insightMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  insightMetric: {
    alignItems: 'center',
  },
  insightMetricLabel: {
    fontSize: 11,
    color: '#95a5a6',
    marginBottom: 4,
  },
  insightMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  insightAction: {
    fontSize: 20,
    color: '#3498db',
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 32,
  },
  actionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  actionSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  // ESTILOS PARA LOS BADGES AI
  aiBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  aiBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Performance Metrics
  metricsGrid: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  metricLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 4,
    fontWeight: '600',
  },
  metricSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  metricBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
    textAlign: 'center',
  },
  statIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },

  // Trending Issues
  trendingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  trendingLeft: {
    flex: 1,
  },
  trendingType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  trendingCount: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  trendingRight: {
    marginLeft: 12,
  },
  trendingIcon: {
    fontSize: 24,
  },

  // AI Recommendations
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  impactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  impactText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  recommendationMetric: {
    alignItems: 'center',
  },
  recommendationMetricLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 4,
  },
  recommendationMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  // Inspections Stats
  inspectionStatsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspectionStatItem: {
    marginBottom: 16,
  },
  inspectionStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  inspectionStatLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    marginBottom: 8,
  },
  inspectionStatBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  inspectionStatFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Alerts
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  alertSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  alertButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Recent Activity
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  activityAsset: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 3,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  activityTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  activityConfidence: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
  },

  // AI Features Banner
  aiFeaturesBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  aiFeaturesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  aiFeaturesDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.95,
    lineHeight: 22,
    marginBottom: 16,
  },
  aiFeaturesList: {
    marginBottom: 20,
  },
  aiFeatureItem: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    opacity: 0.9,
  },
  aiFeaturesButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  aiFeaturesButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 40,
  },
  modalClose: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#95a5a6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  modalBadges: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  modalBadge: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalScroll: {
    maxHeight: height * 0.5,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 16,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: 13,
    color: '#95a5a6',
    marginBottom: 6,
  },
  modalStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalActionBox: {
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  modalActionText: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#ecf0f1',
  },
  modalButtonPrimary: {
    backgroundColor: '#3498db',
  },
  modalButtonTextSecondary: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Dashboard;