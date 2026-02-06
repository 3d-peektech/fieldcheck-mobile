import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AssetsScreen = ({ navigation }) => {
  const [assetStats] = useState({
    total: 247,
    active: 218,
    maintenance: 23,
  });

  const [trendingIssues] = useState([
    { id: 1, title: 'Bearing Wear', occurrences: 7, icon: '📈', trend: 'up' },
    { id: 2, title: 'Corrosion', occurrences: 5, icon: '→', trend: 'stable' },
    { id: 3, title: 'Overheating', occurrences: 3, icon: '📉', trend: 'down' },
    { id: 4, title: 'Vibration', occurrences: 4, icon: '📈', trend: 'up' },
  ]);

  const [recentAssets] = useState([
    { id: 1, name: 'Pump #A-142', status: 'active', location: 'Building A' },
    { id: 2, name: 'Motor #B-456', status: 'maintenance', location: 'Building B' },
    { id: 3, name: 'Compressor #C-789', status: 'active', location: 'Building C' },
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
        {/* Assets Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🏢</Text>
          <Text style={styles.sectionTitle}>Assets Overview</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{assetStats.total}</Text>
            <Text style={styles.statLabel}>Total Assets</Text>
            <View style={[styles.statIndicator, { backgroundColor: '#3b82f6' }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{assetStats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
            <View style={[styles.statIndicator, { backgroundColor: '#10b981' }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{assetStats.maintenance}</Text>
            <Text style={styles.statLabel}>Maintenance</Text>
            <View style={[styles.statIndicator, { backgroundColor: '#f59e0b' }]} />
          </View>
        </View>

        {/* Trending Issues */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📊</Text>
          <Text style={styles.sectionTitle}>Trending Issues</Text>
        </View>

        {trendingIssues.map((issue) => (
          <TouchableOpacity key={issue.id} style={styles.issueCard}>
            <View style={styles.issueContent}>
              <Text style={styles.issueTitle}>{issue.title}</Text>
              <Text style={styles.issueOccurrences}>
                {issue.occurrences} occurrences
              </Text>
            </View>
            <View style={styles.issueTrend}>
              <Text style={styles.trendIcon}>{issue.icon}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Recent Assets */}
        <View style={styles.sectionHeaderWithAction}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🕐</Text>
            <Text style={styles.sectionTitle}>Recent Assets</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All →</Text>
          </TouchableOpacity>
        </View>

        {recentAssets.map((asset) => (
          <TouchableOpacity key={asset.id} style={styles.assetCard}>
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetLocation}>📍 {asset.location}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                asset.status === 'active'
                  ? styles.activeStatus
                  : styles.maintenanceStatus,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  asset.status === 'active'
                    ? styles.activeText
                    : styles.maintenanceText,
                ]}
              >
                {asset.status === 'active' ? 'Active' : 'Maintenance'}
              </Text>
            </View>
          </TouchableOpacity>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
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
    marginTop: 24,
    marginBottom: 16,
  },
  viewAllButton: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
  },
  statIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  issueCard: {
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
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  issueOccurrences: {
    fontSize: 13,
    color: '#64748b',
  },
  issueTrend: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 8,
  },
  trendIcon: {
    fontSize: 20,
  },
  assetCard: {
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
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  assetLocation: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#dcfce7',
  },
  maintenanceStatus: {
    backgroundColor: '#ffedd5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#059669',
  },
  maintenanceText: {
    color: '#ea580c',
  },
});

export default AssetsScreen;
