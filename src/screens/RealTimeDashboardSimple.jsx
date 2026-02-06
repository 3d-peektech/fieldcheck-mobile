import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RealTimeDataService from '../services/RealTimeDataService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 40;

// ==================== TYPES ====================
type TimeRange = '7d' | '30d' | '90d' | '1y';

interface KPI {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface QuickStat {
  label: string;
  value: string;
  icon: string;
}

// ==================== CONSTANTS ====================
const COLORS = {
  primary: '#0F9D58',
  primaryDark: '#0B7F46',
  secondary: '#4285F4',
  warning: '#F4B400',
  danger: '#DB4437',
  background: '#f5f5f5',
  white: '#fff',
  text: {
    primary: '#333',
    secondary: '#666',
    tertiary: '#999',
  },
};

// ==================== MAIN COMPONENT ====================
const RealTimeDashboardSimple: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  // ==================== STATE FOR REAL-TIME DATA ====================
  const [kpisData, setKpisData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [assetHealthData, setAssetHealthData] = useState<any>(null);
  const [inspectionsData, setInspectionsData] = useState<any>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);

  // ==================== REAL-TIME SUBSCRIPTIONS ====================
  useEffect(() => {
    console.log('Setting up real-time subscriptions...');
    
    // Subscribe to KPIs
    const unsubscribeKPIs = RealTimeDataService.subscribeToKPIs((data, error) => {
      if (error) {
        console.error('KPIs subscription error:', error);
        return;
      }
      console.log('KPIs updated:', data);
      setKpisData(data);
      setLoading(false);
    });

    // Subscribe to revenue data
    const unsubscribeRevenue = RealTimeDataService.subscribeToRevenue(
      timeRange,
      (data, error) => {
        if (error) {
          console.error('Revenue subscription error:', error);
          return;
        }
        console.log('Revenue updated:', data);
        setRevenueData(data);
      }
    );

    // Subscribe to asset health
    const unsubscribeHealth = RealTimeDataService.subscribeToAssetHealth((data, error) => {
      if (error) {
        console.error('Asset health subscription error:', error);
        return;
      }
      console.log('Asset health updated:', data);
      setAssetHealthData(data);
    });

    // Subscribe to inspections
    const unsubscribeInspections = RealTimeDataService.subscribeToInspections((data, error) => {
      if (error) {
        console.error('Inspections subscription error:', error);
        return;
      }
      console.log('Inspections updated:', data);
      setInspectionsData(data);
    });

    // Subscribe to notifications (if user is logged in)
    const userId = RealTimeDataService.getCurrentUserId();
    let unsubscribeNotifications = () => {};
    
    if (userId) {
      unsubscribeNotifications = RealTimeDataService.subscribeToNotifications(
        userId,
        (notifications, error) => {
          if (error) {
            console.error('Notifications subscription error:', error);
            return;
          }
          setNotificationsCount(notifications.length);
        }
      );
    }

    // Cleanup subscriptions on unmount
    return () => {
      console.log('Cleaning up subscriptions...');
      unsubscribeKPIs();
      unsubscribeRevenue();
      unsubscribeHealth();
      unsubscribeInspections();
      unsubscribeNotifications();
    };
  }, [timeRange]);

  // ==================== FORMATTED DATA ====================
  const kpis: KPI[] = useMemo(() => {
    if (!kpisData) return [];
    
    return [
      {
        id: '1',
        label: kpisData.revenue?.label || 'Total Revenue',
        value: `$${(kpisData.revenue?.value / 1000).toFixed(1)}K`,
        change: kpisData.revenue?.change || 0,
        icon: kpisData.revenue?.icon || 'cash-multiple',
        color: kpisData.revenue?.color || COLORS.primary,
      },
      {
        id: '2',
        label: kpisData.roi?.label || 'ROI Average',
        value: `${kpisData.roi?.value}%`,
        change: kpisData.roi?.change || 0,
        icon: kpisData.roi?.icon || 'chart-line',
        color: kpisData.roi?.color || COLORS.secondary,
      },
      {
        id: '3',
        label: kpisData.assets?.label || 'Active Assets',
        value: String(kpisData.assets?.value || 0),
        change: kpisData.assets?.change || 0,
        icon: kpisData.assets?.icon || 'cube-outline',
        color: kpisData.assets?.color || COLORS.warning,
      },
      {
        id: '4',
        label: kpisData.issues?.label || 'Critical Issues',
        value: String(kpisData.issues?.value || 0),
        change: kpisData.issues?.change || 0,
        icon: kpisData.issues?.icon || 'alert-circle',
        color: kpisData.issues?.color || COLORS.danger,
      },
    ];
  }, [kpisData]);

  const quickStats: QuickStat[] = useMemo(
    () => [
      { label: 'Today Inspections', value: '12', icon: 'clipboard-check' },
      { label: 'Pending Reports', value: '5', icon: 'file-document' },
      { label: 'AI Predictions', value: '94.3%', icon: 'brain' },
      { label: 'Uptime', value: '99.8%', icon: 'server' },
    ],
    []
  );

  // Format revenue chart data
  const revenueChartData = useMemo(() => {
    if (!revenueData) return { labels: [], data: [] };
    return {
      labels: revenueData.labels || [],
      data: revenueData.data || [],
    };
  }, [revenueData]);

  // Format inspections chart data
  const inspectionsChartData = useMemo(() => {
    if (!inspectionsData) return { labels: [], data: [] };
    return {
      labels: ['Electrical', 'Mechanical', 'Safety', 'Quality'],
      data: [
        inspectionsData.electrical || 0,
        inspectionsData.mechanical || 0,
        inspectionsData.safety || 0,
        inspectionsData.quality || 0,
      ],
    };
  }, [inspectionsData]);

  // Format asset health pie chart data
  const healthChartData = useMemo(() => {
    if (!assetHealthData) return [];
    return [
      {
        name: 'Excellent',
        population: assetHealthData.excellent || 0,
        color: '#0F9D58',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Good',
        population: assetHealthData.good || 0,
        color: '#4285F4',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Fair',
        population: assetHealthData.fair || 0,
        color: '#F4B400',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Poor',
        population: assetHealthData.poor || 0,
        color: '#DB4437',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
    ];
  }, [assetHealthData]);

  // ==================== HANDLERS ====================
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch fresh data from Firebase
      const data = await RealTimeDataService.getDashboardData();
      console.log('Refreshed dashboard data:', data);
      
      // Update state with fresh data
      if (data.kpis) setKpisData(data.kpis);
      if (data.revenue) setRevenueData(data.revenue);
      if (data.assetHealth) setAssetHealthData(data.assetHealth);
      if (data.inspections) setInspectionsData(data.inspections);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);

  // ==================== CHART CONFIGS ====================
  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    color: (opacity = 1) => `rgba(15, 157, 88, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 10,
    },
  };

  // ==================== RENDER ====================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Real-Time Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              {kpisData?.timestamp ? 'Updated: Just now' : 'Connecting...'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation?.navigate('NotificationsCenter')}
          >
            <Icon name="bell" size={24} color={COLORS.white} />
            {notificationsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* KPIs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.kpiGrid}>
            {kpis.map((kpi) => (
              <View key={kpi.id} style={styles.kpiCard}>
                <View style={styles.kpiHeader}>
                  <View style={[styles.kpiIcon, { backgroundColor: `${kpi.color}20` }]}>
                    <Icon name={kpi.icon} size={24} color={kpi.color} />
                  </View>
                  <View
                    style={[
                      styles.changeIndicator,
                      { backgroundColor: kpi.change >= 0 ? '#E8F5E9' : '#FFEBEE' },
                    ]}
                  >
                    <Icon
                      name={kpi.change >= 0 ? 'trending-up' : 'trending-down'}
                      size={14}
                      color={kpi.change >= 0 ? COLORS.primary : COLORS.danger}
                    />
                    <Text
                      style={[
                        styles.changeText,
                        { color: kpi.change >= 0 ? COLORS.primary : COLORS.danger },
                      ]}
                    >
                      {Math.abs(kpi.change)}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Time Range Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Trend</Text>
          <View style={styles.timeRangeSelector}>
            {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
                onPress={() => handleTimeRangeChange(range)}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === range && styles.timeRangeTextActive,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Revenue Line Chart */}
          {revenueChartData.data.length > 0 && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: revenueChartData.labels,
                  datasets: [
                    {
                      data: revenueChartData.data,
                      color: (opacity = 1) => `rgba(15, 157, 88, ${opacity})`,
                      strokeWidth: 3,
                    },
                  ],
                }}
                width={CHART_WIDTH}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withDots={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                formatYLabel={(value) => `$${(parseFloat(value) / 1000).toFixed(0)}K`}
              />
            </View>
          )}
        </View>

        {/* Asset Health Distribution */}
        {healthChartData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Asset Health Distribution</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={healthChartData}
                width={CHART_WIDTH}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={true}
              />
            </View>
          </View>
        )}

        {/* Inspections by Category */}
        {inspectionsChartData.data.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspections This Month</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: inspectionsChartData.labels,
                  datasets: [
                    {
                      data: inspectionsChartData.data,
                    },
                  ],
                }}
                width={CHART_WIDTH}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
                }}
                style={styles.chart}
                showValuesOnTopOfBars={true}
                fromZero={true}
              />
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.quickStatsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.quickStatCard}>
                <Icon name={stat.icon} size={28} color={COLORS.primary} />
                <Text style={styles.quickStatValue}>{stat.value}</Text>
                <Text style={styles.quickStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 15,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: '47.5%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeRangeText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickStatCard: {
    width: '47.5%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
});

// ==================== CHART CONFIG ====================
const chartConfig = {
  backgroundGradientFrom: COLORS.white,
  backgroundGradientTo: COLORS.white,
  color: (opacity = 1) => `rgba(15, 157, 88, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  propsForLabels: {
    fontSize: 10,
  },
};

export default RealTimeDashboardSimple;