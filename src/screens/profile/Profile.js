import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { authAPI, paymentsAPI } from '../api';

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    autoSync: true,
  });

  useEffect(() => {
    loadUserData();
    loadSubscription();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.user);
      if (data.settings) {
        setSettings(data.settings);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const loadSubscription = async () => {
    try {
      const data = await paymentsAPI.getSubscription();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.logout();
              Alert.alert('Success', 'You have been logged out');
              // Navigate to login screen
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const toggleSetting = async (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting],
    };
    setSettings(newSettings);

    try {
      await authAPI.updateSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revert on error
      setSettings(settings);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={() => Alert.alert('Edit Photo', 'Photo upload coming soon')}
          >
            <Text style={styles.editAvatarText}>✏️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        {user.company && (
          <View style={styles.companyBadge}>
            <Text style={styles.companyText}>{user.company}</Text>
          </View>
        )}
      </View>

      {/* Subscription Card */}
      {subscription ? (
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <View>
              <Text style={styles.subscriptionLabel}>Current Plan</Text>
              <Text style={styles.subscriptionPlan}>{subscription.plan}</Text>
            </View>
            <View style={[
              styles.subscriptionStatusBadge,
              { backgroundColor: subscription.status === 'active' ? '#27ae60' : '#e74c3c' }
            ]}>
              <Text style={styles.subscriptionStatusText}>
                {subscription.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.subscriptionRenew}>
            Renews on: {new Date(subscription.renewsOn || subscription.currentPeriodEnd).toLocaleDateString()}
          </Text>

          <View style={styles.subscriptionActions}>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('PaymentScreen')}
            >
              <Text style={styles.upgradeButtonText}>⬆️ Upgrade Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate('SubscriptionScreen')}
            >
              <Text style={styles.manageButtonText}>⚙️ Manage</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.upgradePrompt}
          onPress={() => navigation.navigate('PaymentScreen')}
        >
          <Text style={styles.upgradePromptIcon}>⭐</Text>
          <View style={styles.upgradePromptContent}>
            <Text style={styles.upgradePromptTitle}>Upgrade to Pro</Text>
            <Text style={styles.upgradePromptText}>
              Unlock AI analysis, unlimited assets, and more
            </Text>
          </View>
          <Text style={styles.upgradePromptArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive push notifications for important updates
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: '#ccc', true: '#3498db' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Email Updates</Text>
            <Text style={styles.settingDescription}>
              Get email notifications for weekly reports
            </Text>
          </View>
          <Switch
            value={settings.emailUpdates}
            onValueChange={() => toggleSetting('emailUpdates')}
            trackColor={{ false: '#ccc', true: '#3498db' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto Sync</Text>
            <Text style={styles.settingDescription}>
              Automatically sync data in background
            </Text>
          </View>
          <Switch
            value={settings.autoSync}
            onValueChange={() => toggleSetting('autoSync')}
            trackColor={{ false: '#ccc', true: '#3498db' }}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Account Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Export Data', 'Data export feature coming soon')}
        >
          <Text style={styles.menuIcon}>📥</Text>
          <Text style={styles.menuText}>Export Data</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Support & Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help Center</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TermsOfService')}
        >
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appCopyright}>© 2026 FieldCheck. All rights reserved.</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editAvatarText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#ecf0f1',
    marginBottom: 10,
  },
  companyBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  companyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subscriptionLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  subscriptionPlan: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subscriptionStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subscriptionRenew: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  subscriptionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  manageButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  upgradePrompt: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upgradePromptIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  upgradePromptContent: {
    flex: 1,
  },
  upgradePromptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  upgradePromptText: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  upgradePromptArrow: {
    fontSize: 30,
    color: '#3498db',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 15,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#2c3e50',
  },
  menuArrow: {
    fontSize: 20,
    color: '#95a5a6',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
  },
  appVersion: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 11,
    color: '#95a5a6',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 15,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
