import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    aiEfficiency: { value: '87.5%', change: '+12%', positive: true },
    costSaved: { value: '$45.2K', change: '+23%', positive: true },
    criticalAlerts: { value: '5', change: '-5%', positive: false },
    availability: { value: '98.5%', change: '+3%', positive: true },
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: '2 critical maintenance overdue',
      assets: 'D-456, E-789',
      icon: '🚨',
    },
    {
      id: 2,
      type: 'warning',
      title: '3 assets need inspection this week',
      assets: 'A-145, B-092, C-234',
      icon: '⚠️',
    },
    {
      id: 3,
      type: 'info',
      title: '5 predictive maintenance recommended',
      assets: 'F-123, G-456, H-789, I-012, J-345',
      icon: 'ℹ️',
    },
  ]);

  const [trendingIssues, setTrendingIssues] = useState([
    { id: 1, title: 'Bearing Wear', occurrences: 7, icon: '📈' },
    { id: 2, title: 'Corrosion', occurrences: 5, icon: '📊' },
    { id: 3, title: 'Vibration', occurrences: 4, icon: '📈' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1e3a5f', '#2c5282']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Aimar Garcia</Text>
            <Text style={styles.subtitle}>AI-Powered Asset Management</Text>
          </View>
          <View style={styles.notificationContainer}>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
            <Text style={styles.notificationIcon}>🔔</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets, alerts, recommendations..."
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Key Metrics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📊</Text>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
        </View>

        <View style={styles.metricsGrid}>
          {/* AI Efficiency */}
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            style={styles.metricCard}
          >
            <Text style={styles.metricValue}>{stats.aiEfficiency.value}</Text>
            <Text style={styles.metricLabel}>AI Efficiency</Text>
            <Text style={[styles.metricChange, styles.positiveChange]}>
              ↑ {stats.aiEfficiency.change}
            </Text>
            <View style={styles.metricIconContainer}>
              <Text style={styles.metricEmoji}>🤖</Text>
            </View>
          </LinearGradient>

          {/* Cost Saved */}
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.metricCard}
          >
            <Text style={styles.metricValue}>{stats.costSaved.value}</Text>
            <Text style={styles.metricLabel}>Cost Saved</Text>
            <Text style={[styles.metricChange, styles.positiveChange]}>
              ↑ {stats.costSaved.change}
            </Text>
            <View style={styles.metricIconContainer}>
              <Text style={styles.metricEmoji}>💰</Text>
            </View>
          </LinearGradient>

          {/* Critical Alerts */}
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.metricCard}
          >
            <Text style={styles.metricValue}>{stats.criticalAlerts.value}</Text>
            <Text style={styles.metricLabel}>Critical Alerts</Text>
            <Text style={[styles.metricChange, styles.negativeChange]}>
              ↓ {stats.criticalAlerts.change}
            </Text>
            <View style={styles.metricIconContainer}>
              <Text style={styles.metricEmoji}>⚠️</Text>
            </View>
          </LinearGradient>

          {/* Availability */}
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.metricCard}
          >
            <Text style={styles.metricValue}>{stats.availability.value}</Text>
            <Text style={styles.metricLabel}>Availability</Text>
            <Text style={[styles.metricChange, styles.positiveChange]}>
              ↑ {stats.availability.change}
            </Text>
            <View style={styles.metricIconContainer}>
              <Text style={styles.metricEmoji}>📊</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>⚡</Text>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#dbeafe' }]}
            onPress={() => navigation.navigate('ScanAsset')}
          >
            <View style={styles.actionIconCircle}>
              <Text style={styles.actionIcon}>📱</Text>
            </View>
            <Text style={styles.actionTitle}>Scan Asset</Text>
            <Text style={styles.actionSubtitle}>QR/Barcode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#f3e8ff' }]}
            onPress={() => navigation.navigate('AIAnalysis')}
          >
            <View style={styles.actionIconCircle}>
              <Text style={styles.actionIcon}>✨</Text>
            </View>
            <Text style={styles.actionTitle}>AI Analysis</Text>
            <Text style={styles.actionSubtitle}>Smart Detect</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#dcfce7' }]}
            onPress={() => navigation.navigate('NewInspection')}
          >
            <View style={styles.actionIconCircle}>
              <Text style={styles.actionIcon}>📋</Text>
            </View>
            <Text style={styles.actionTitle}>New Inspection</Text>
            <Text style={styles.actionSubtitle}>Quick Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#ffedd5' }]}
            onPress={() => navigation.navigate('AddAsset')}
          >
            <View style={styles.actionIconCircle}>
              <Text style={styles.actionIcon}>➕</Text>
            </View>
            <Text style={styles.actionTitle}>Add Asset</Text>
            <Text style={styles.actionSubtitle}>Register New</Text>
          </TouchableOpacity>
        </View>

        {/* AI Insights */}
        <View style={styles.sectionHeaderWithAction}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🤖</Text>
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>⚠️</Text>
            <Text style={styles.insightPercentage}>78%</Text>
          </View>
          <Text style={styles.insightTitle}>Predictive Maintenance Alert</Text>
          <Text style={styles.insightDescription}>
            Pump #A-142 shows early signs of bearing wear. Recommend inspection within 7 days.
          </Text>
        </View>

        {/* Predictive Alerts */}
        <View style={styles.sectionHeaderWithAction}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⚡</Text>
            <Text style={styles.sectionTitle}>Predictive Alerts</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All →</Text>
          </TouchableOpacity>
        </View>

        {alerts.map((alert) => (
          <View
            key={alert.id}
            style={[
              styles.alertCard,
              alert.type === 'critical' && styles.criticalAlert,
              alert.type === 'warning' && styles.warningAlert,
              alert.type === 'info' && styles.infoAlert,
            ]}
          >
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertAssets}>Assets: {alert.assets}</Text>
            </View>
            <Text style={styles.alertIcon}>{alert.icon}</Text>
          </View>
        ))}

        {/* Trending Issues */}
        <View style={styles.sectionHeaderWithAction}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📈</Text>
            <Text style={styles.sectionTitle}>Trending Issues</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All →</Text>
          </TouchableOpacity>
        </View>

        {trendingIssues.map((issue) => (
          <View key={issue.id} style={styles.trendingCard}>
            <View style={styles.trendingContent}>
              <Text style={styles.trendingTitle}>{issue.title}</Text>
              <Text style={styles.trendingOccurrences}>
                {issue.occurrences} occurrences
              </Text>
            </View>
            <Text style={styles.trendingIcon}>{issue.icon}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 14,
    color: '#94c5f8',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#60a5fa',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 28,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  viewAllButton: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    margin: '1%',
    borderRadius: 16,
    padding: 20,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  metricChange: {
    fontSize: 13,
    fontWeight: '600',
  },
  positiveChange: {
    color: '#ffffff',
  },
  negativeChange: {
    color: '#ffffff',
    opacity: 0.8,
  },
  metricIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  metricEmoji: {
    fontSize: 28,
    opacity: 0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    margin: '1%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  insightPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  criticalAlert: {
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  warningAlert: {
    borderLeftColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  infoAlert: {
    borderLeftColor: '#3b82f6',
    backgroundColor: '#f8fafc',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  alertAssets: {
    fontSize: 13,
    color: '#64748b',
  },
  alertIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  trendingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  trendingOccurrences: {
    fontSize: 13,
    color: '#64748b',
  },
  trendingIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
});

export default HomeScreen;
