// 📊 DASHBOARD SCREEN - COPY & PASTE READY
// Pantalla de dashboard con datos en tiempo real desde Firebase
// Archivo: src/screens/RealTimeDashboardScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RealTimeDataService from '../services/RealTimeDataService';

const { width } = Dimensions.get('window');

export default function RealTimeDashboardScreen({ navigation }) {
  // ============================================
  // STATE
  // ============================================
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // '7d' or '30d'
  
  // Data states
  const [kpis, setKpis] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [assetHealth, setAssetHealth] = useState(null);
  const [inspections, setInspections] = useState(null);
  
  // Notification count (ejemplo estático, puedes hacerlo dinámico)
  const [notificationCount, setNotificationCount] = useState(3);

  // ============================================
  // FIREBASE REAL-TIME SUBSCRIPTIONS
  // ============================================
  useEffect(() => {
    let unsubscribeKPIs;
    let unsubscribeRevenue;
    let unsubscribeAssetHealth;
    let unsubscribeInspections;

    const setupSubscriptions = () => {
      // KPIs en tiempo real
      unsubscribeKPIs = RealTimeDataService.subscribeToKPIs((result) => {
        if (result.success) {
          setKpis(result.data);
        } else {
          console.error('Error loading KPIs:', result.error);
        }
        setLoading(false);
      });

      // Revenue chart en tiempo real
      unsubscribeRevenue = RealTimeDataService.subscribeToRevenueChart(
        timeRange,
        (result) => {
          if (result.success) {
            setRevenueData(result.data);
          } else {
            console.error('Error loading revenue data:', result.error);
          }
        }
      );

      // Asset Health en tiempo real
      unsubscribeAssetHealth = RealTimeDataService.subscribeToAssetHealth(
        (result) => {
          if (result.success) {
            setAssetHealth(result.data);
          } else {
            console.error('Error loading asset health:', result.error);
          }
        }
      );

      // Inspections en tiempo real
      unsubscribeInspections = RealTimeDataService.subscribeToInspections(
        (result) => {
          if (result.success) {
            setInspections(result.data);
          } else {
            console.error('Error loading inspections:', result.error);
          }
        }
      );
    };

    setupSubscriptions();

    // Cleanup: cancelar todas las subscripciones al desmontar
    return () => {
      if (unsubscribeKPIs) unsubscribeKPIs();
      if (unsubscribeRevenue) unsubscribeRevenue();
      if (unsubscribeAssetHealth) unsubscribeAssetHealth();
      if (unsubscribeInspections) unsubscribeInspections();
    };
  }, [timeRange]); // Re-subscribe cuando cambia el timeRange

  // ============================================
  // HANDLERS
  // ============================================
  const handleRefresh = () => {
    setRefreshing(true);
    // Las subscripciones se actualizarán automáticamente
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // ============================================
  // RENDER HELPERS
  // ============================================
  const renderKPICard = (kpi, key) => {
    if (!kpi) return null;

    const isPositive = kpi.change >= 0;
    const changeIcon = isPositive ? 'arrow-up' : 'arrow-down';
    const changeColor = isPositive ? '#0F9D58' : '#DB4437';

    return (
      <View key={key} style={styles.kpiCard}>
        <View style={styles.kpiHeader}>
          <Icon name={kpi.icon} size={24} color={kpi.color} />
          <Text style={styles.kpiLabel}>{kpi.label}</Text>
        </View>
        <Text style={styles.kpiValue}>
          {typeof kpi.value === 'number' && kpi.value > 1000
            ? `$${(kpi.value / 1000).toFixed(1)}K`
            : kpi.value}
        </Text>
        <View style={styles.kpiChange}>
          <Icon name={changeIcon} size={16} color={changeColor} />
          <Text style={[styles.kpiChangeText, { color: changeColor }]}>
            {Math.abs(kpi.change)}%
          </Text>
        </View>
      </View>
    );
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  // ============================================
  // PREPARE CHART DATA
  // ============================================
  const revenueChartData = revenueData
    ? {
        labels: revenueData.labels || [],
        datasets: [
          {
            data: revenueData.data || [],
            color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
            strokeWidth: 3,
          },
        ],
      }
    : null;

  const assetHealthChartData = assetHealth
    ? [
        {
          name: 'Excellent',
          population: assetHealth.excellent || 0,
          color: '#0F9D58',
          legendFontColor: '#333',
        },
        {
          name: 'Good',
          population: assetHealth.good || 0,
          color: '#F4B400',
          legendFontColor: '#333',
        },
        {
          name: 'Fair',
          population: assetHealth.fair || 0,
          color: '#FF9800',
          legendFontColor: '#333',
        },
        {
          name: 'Poor',
          population: assetHealth.poor || 0,
          color: '#DB4437',
          legendFontColor: '#333',
        },
      ]
    : [];

  const inspectionsChartData = inspections
    ? {
        labels: ['Electric', 'Mechanic', 'Safety', 'Quality'],
        datasets: [
          {
            data: [
              inspections.electrical || 0,
              inspections.mechanical || 0,
              inspections.safety || 0,
              inspections.quality || 0,
            ],
          },
        ],
      }
    : null;

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={['#4285F4', '#34A853']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Dashboard</Text>
          
          <TouchableOpacity
            onPress={() => Alert.alert('Notifications', 'No new notifications')}
            style={styles.notificationButton}
          >
            <Icon name="bell-outline" size={24} color="#FFF" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* KPI CARDS */}
        <View style={styles.kpiContainer}>
          {kpis && (
            <>
              {renderKPICard(kpis.revenue, 'revenue')}
              {renderKPICard(kpis.roi, 'roi')}
              {renderKPICard(kpis.assets, 'assets')}
              {renderKPICard(kpis.issues, 'issues')}
            </>
          )}
        </View>

        {/* REVENUE CHART */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue Trend</Text>
            <View style={styles.timeRangeSelector}>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === '7d' && styles.timeRangeButtonActive,
                ]}
                onPress={() => handleTimeRangeChange('7d')}
              >
                <Text
                  style={[
                    styles.timeRangeButtonText,
                    timeRange === '7d' && styles.timeRangeButtonTextActive,
                  ]}
                >
                  7D
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === '30d' && styles.timeRangeButtonActive,
                ]}
                onPress={() => handleTimeRangeChange('30d')}
              >
                <Text
                  style={[
                    styles.timeRangeButtonText,
                    timeRange === '30d' && styles.timeRangeButtonTextActive,
                  ]}
                >
                  30D
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {revenueChartData && (
            <LineChart
              data={revenueChartData}
              width={width - 48}
              height={220}
              chartConfig={{
                backgroundColor: '#FFF',
                backgroundGradientFrom: '#FFF',
                backgroundGradientTo: '#FFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#4285F4',
                },
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        {/* ASSET HEALTH CHART */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Asset Health Distribution</Text>
          {assetHealthChartData.length > 0 && (
            <PieChart
              data={assetHealthChartData}
              width={width - 48}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          )}
        </View>

        {/* INSPECTIONS CHART */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Inspections by Type</Text>
          {inspectionsChartData && (
            <BarChart
              data={inspectionsChartData}
              width={width - 48}
              height={220}
              chartConfig={{
                backgroundColor: '#FFF',
                backgroundGradientFrom: '#FFF',
                backgroundGradientTo: '#FFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(52, 168, 83, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          )}
        </View>

        {/* FOOTER SPACE */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DB4437',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: (width - 36) / 2,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  kpiChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kpiChangeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 2,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#4285F4',
  },
  timeRangeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  timeRangeButtonTextActive: {
    color: '#FFF',
  },
  chart: {
    borderRadius: 16,
  },
});