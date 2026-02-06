import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);

  const SettingItem = ({ icon, title, subtitle, onPress, showArrow = true, rightElement }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement ? (
        rightElement
      ) : showArrow ? (
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      ) : null}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* General Settings */}
      <SettingSection title="General">
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Push notifications for alerts"
          showArrow={false}
          rightElement={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#cbd5e1', true: colors.primary }}
              thumbColor="#ffffff"
            />
          }
        />
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Coming soon"
          showArrow={false}
          rightElement={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#cbd5e1', true: colors.primary }}
              thumbColor="#ffffff"
            />
          }
        />
        <SettingItem
          icon="sync-outline"
          title="Auto Sync"
          subtitle="Automatically sync data"
          showArrow={false}
          rightElement={
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#cbd5e1', true: colors.primary }}
              thumbColor="#ffffff"
            />
          }
        />
        <SettingItem
          icon="language-outline"
          title="Language"
          subtitle="English (US)"
          onPress={() => Alert.alert('Language', 'More languages coming soon!')}
        />
      </SettingSection>

      {/* Account Settings */}
      <SettingSection title="Account">
        <SettingItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your information"
          onPress={() => Alert.alert('Edit Profile', 'Coming soon!')}
        />
        <SettingItem
          icon="key-outline"
          title="Change Password"
          subtitle="Update your password"
          onPress={() => Alert.alert('Change Password', 'Coming soon!')}
        />
        <SettingItem
          icon="card-outline"
          title="Subscription"
          subtitle="Manage your plan"
          onPress={() => Alert.alert('Subscription', 'Coming soon!')}
        />
      </SettingSection>

      {/* Data & Storage */}
      <SettingSection title="Data & Storage">
        <SettingItem
          icon="cloud-download-outline"
          title="Download Data"
          subtitle="Export your data"
          onPress={() => Alert.alert('Download', 'Preparing your data...')}
        />
        <SettingItem
          icon="trash-outline"
          title="Clear Cache"
          subtitle="Free up storage space"
          onPress={() =>
            Alert.alert('Clear Cache', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared!') },
            ])
          }
        />
      </SettingSection>

      {/* Support & Help */}
      <SettingSection title="Support">
        <SettingItem
          icon="help-circle-outline"
          title="Help Center"
          subtitle="Get help and support"
          onPress={() => Alert.alert('Help Center', 'Visit support.fieldcheck.com')}
        />
        <SettingItem
          icon="chatbubble-outline"
          title="Contact Us"
          subtitle="Send us a message"
          onPress={() => Alert.alert('Contact', 'Email: support@fieldcheck.com')}
        />
        <SettingItem
          icon="bug-outline"
          title="Report a Bug"
          subtitle="Help us improve"
          onPress={() => Alert.alert('Report Bug', 'Thank you for your feedback!')}
        />
      </SettingSection>

      {/* About */}
      <SettingSection title="About">
        <SettingItem
          icon="information-circle-outline"
          title="About FieldCheck"
          subtitle="Version 1.0.0"
          onPress={() => Alert.alert('FieldCheck AI', 'Version 1.0.0\n© 2026 FieldCheck Inc.')}
        />
        <SettingItem
          icon="document-text-outline"
          title="Terms of Service"
          onPress={() => Alert.alert('Terms', 'Opening terms...')}
        />
        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy', 'Opening privacy policy...')}
        />
        <SettingItem
          icon="star-outline"
          title="Rate App"
          onPress={() => Alert.alert('Rate Us', 'Thank you for your support!')}
        />
      </SettingSection>

      {/* Danger Zone */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() =>
            Alert.alert('Delete Account', 'This action cannot be undone!', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive' },
            ])
          }
        >
          <Ionicons name="warning-outline" size={20} color="#ef4444" />
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});

export default SettingsScreen;
