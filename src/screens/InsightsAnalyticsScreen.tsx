import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

const InsightsAnalyticsScreen = ({ navigation }: any) => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Simulated real-time data (in production, fetch from API)
  const [liveMetrics, setLiveMetrics] = useState({
    totalSavings: 45234,
    criticalIssues: 8,
    activeAssets: 247,
    aiAccuracy: 94.3,
    costTrend: 2.4, // percentage change
    efficiencyGain: 18.7,
  });

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        totalSavings: prev.totalSavings + Math.floor(Math.random() * 100),
        aiAccuracy: 94 + Math.random() * 1,
        costTrend: -5 + Math.random() * 10,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Chart data
  const savingsOverTime = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [2800, 3200, 4100, 3800, 5200, 6100, 7234],
      color: (opacity = 1) => `rgba(15, 157, 88, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const issuesByCategory = {
    labels: ['Mechanical', 'Electrical', 'Structural', 'Safety', 'Other'],
    datasets: [{
      data: [45, 32, 18, 12, 8],
    }],
  };

  const assetHealthDistribution = [
    { name: 'Healthy', count: 189, percentage: 76, color: '#0F9D58' },
    { name: 'Warning', count: 42, percentage: 17, color: '#F4B400' },
    { name: 'Critical', count: 16, percentage: 7, color: '#DB4437' },
  ];

  const predictiveInsights = [
    {
      title: 'Maintenance Window Optimization',
      impact: '$12.3K savings',
      confidence: 92,
      priority: 'high',
      icon: 'calendar-clock',
      color: '#0F9D58',
    },
    {
      title: 'Energy Efficiency Opportunity',
      impact: '23% reduction',
      confidence: 88,
      priority: 'high',
      icon: 'lightning-bolt',
      color: '#F4B400',
    },
    {
      title: 'Equipment Replacement Planning',
      impact: '$45K cost avoidance',
      confidence: 85,
      priority: 'medium',
      icon: 'swap-horizontal',
      color: '#4285F4',
    },
  ];

  const timeRanges = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F4B400" />
      
      {/* Header */}
      <LinearGradient colors={['#F4B400', '#DB9200']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Insights & Analytics</Text>
            <Text style={styles.headerSubtitle}>Real-time data updates</Text>
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <Icon name="download" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Live indicator */}
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live • Updated 2s ago</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.timeRangeButton,
                timeRange === range.value && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range.value)}
            >
              <Text style={[
                styles.timeRangeText,
                timeRange === range.value && styles.timeRangeTextActive,
              ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Savings"
            value={`$${(liveMetrics.totalSavings / 1000).toFixed(1)}K`}
            trend={liveMetrics.costTrend}
            icon="cash-multiple"
            gradient={['#0F9D58', '#0B7F46']}
          />
          <MetricCard
            title="Critical Issues"
            value={liveMetrics.criticalIssues.toString()}
            trend={-12}
            icon="alert-circle"
            gradient={['#DB4437', '#C1351D']}
          />
          <MetricCard
            title="Active Assets"
            value={liveMetrics.activeAssets.toString()}
            trend={3}
            icon="factory"
            gradient={['#4285F4', '#3367D6']}
          />
          <MetricCard
            title="AI Accuracy"
            value={`${liveMetrics.aiAccuracy.toFixed(1)}%`}
            trend={0.8}
            icon="robot"
            gradient={['#F4B400', '#DB9200']}
          />
        </View>

        {/* Savings Over Time Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Cost Savings Trend</Text>
            <TouchableOpacity>
              <Icon name="information-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <LineChart
            data={savingsOverTime}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(15, 157, 88, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#0F9D58',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Issues by Category */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Issues by Category</Text>
            <Text style={styles.chartSubtitle}>Last 30 days</Text>
          </View>
          <BarChart
            data={issuesByCategory}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        {/* Asset Health Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Asset Health Distribution</Text>
          <View style={styles.healthDistribution}>
            {assetHealthDistribution.map((item, index) => (
              <View key={index} style={styles.healthItem}>
                <View style={styles.healthBar}>
                  <View 
                    style={[
                      styles.healthBarFill,
                      { 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.healthInfo}>
                  <View style={styles.healthLabel}>
                    <View style={[styles.healthDot, { backgroundColor: item.color }]} />
                    <Text style={styles.healthName}>{item.name}</Text>
                  </View>
                  <Text style={styles.healthCount}>
                    {item.count} assets ({item.percentage}%)
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Predictive Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Predictive Insights</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {predictiveInsights.map((insight, index) => (
            <TouchableOpacity key={index} style={styles.insightCard}>
              <LinearGradient
                colors={[insight.color, insight.color + 'CC']}
                style={styles.insightIcon}
              >
                <Icon name={insight.icon} size={24} color="#fff" />
              </LinearGradient>
              
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightImpact}>{insight.impact}</Text>
                <View style={styles.insightFooter}>
                  <View style={styles.confidenceBadge}>
                    <Icon name="check-circle" size={14} color="#0F9D58" />
                    <Text style={styles.confidenceText}>
                      {insight.confidence}% confidence
                    </Text>
                  </View>
                  <View style={[
                    styles.priorityBadge,
                    insight.priority === 'high' && styles.priorityHigh,
                  ]}>
                    <Text style={styles.priorityText}>
                      {insight.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const MetricCard = ({ title, value, trend, icon, gradient }: any) => (
  <View style={styles.metricCard}>
    <LinearGradient colors={gradient} style={styles.metricGradient}>
      <Icon name={icon} size={24} color="#fff" style={styles.metricIcon} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricTrend}>
        <Icon 
          name={trend >= 0 ? 'trending-up' : 'trending-down'} 
          size={14} 
          color="#fff" 
        />
        <Text style={styles.metricTrendText}>
          {Math.abs(trend).toFixed(1)}%
        </Text>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  liveText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 1,
  },
  timeRangeButtonActive: {
    backgroundColor: '#4285F4',
    elevation: 3,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
  },
  metricCard: {
    width: '48%',
    marginBottom: 5,
  },
  metricGradient: {
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricTrendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  healthDistribution: {
    marginTop: 15,
  },
  healthItem: {
    marginBottom: 20,
  },
  healthBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  healthName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  healthCount: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4285F4',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  insightImpact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F9D58',
    marginBottom: 8,
  },
  insightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  priorityHigh: {
    backgroundColor: '#FFEBEE',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default InsightsAnalyticsScreen;
