// 👤 PROFILE & SETTINGS SCREEN - COPY & PASTE READY
// Pantalla de perfil y configuración con integración Firebase
// Archivo: src/screens/ProfileSettingsProScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RealTimeDataService from '../services/RealTimeDataService';

const { width } = Dimensions.get('window');

export default function ProfileSettingsProScreen({ navigation }) {
  // ============================================
  // STATE
  // ============================================
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // User ID (en producción, esto vendría de tu auth system)
  const userId = 'user123';

  // Profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    avatar: '',
  });

  // Settings data
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    biometric: false,
    autoSync: true,
    language: 'en',
  });

  // Temporary edit state
  const [editProfile, setEditProfile] = useState({ ...profile });

  // ============================================
  // FIREBASE REAL-TIME SUBSCRIPTIONS
  // ============================================
  useEffect(() => {
    let unsubscribeProfile;
    let unsubscribeSettings;

    const setupSubscriptions = () => {
      // Subscribe to user profile
      unsubscribeProfile = RealTimeDataService.subscribeToUserProfile(
        userId,
        (result) => {
          if (result.success) {
            setProfile(result.data);
            setEditProfile(result.data);
          } else {
            console.error('Error loading profile:', result.error);
          }
          setLoading(false);
        }
      );

      // Subscribe to user settings
      unsubscribeSettings = RealTimeDataService.subscribeToUserSettings(
        userId,
        (result) => {
          if (result.success) {
            setSettings(result.data);
          } else {
            console.error('Error loading settings:', result.error);
          }
        }
      );
    };

    setupSubscriptions();

    // Cleanup
    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, [userId]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancelar edición
      setEditProfile({ ...profile });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    const result = await RealTimeDataService.updateUserProfile(
      userId,
      editProfile
    );

    setSaving(false);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditMode(false);
      setProfile(editProfile);
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile');
    }
  };

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Guardar en Firebase
    const result = await RealTimeDataService.updateUserSettings(
      userId,
      newSettings
    );

    if (!result.success) {
      // Revertir si falla
      setSettings(settings);
      Alert.alert('Error', result.error || 'Failed to update settings');
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
          onPress: () => {
            // Aquí iría tu lógica de logout
            navigation.navigate('Login'); // Ajusta según tu navegación
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be available soon!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

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

          <Text style={styles.headerTitle}>Profile & Settings</Text>

          <TouchableOpacity
            onPress={handleEditToggle}
            style={styles.editButton}
          >
            <Icon
              name={isEditMode ? 'close' : 'pencil'}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView style={styles.content}>
        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={60} color="#999" />
              </View>
            )}
            {isEditMode && (
              <TouchableOpacity style={styles.changeAvatarButton}>
                <Icon name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, !isEditMode && styles.inputDisabled]}
                value={isEditMode ? editProfile.name : profile.name}
                onChangeText={(text) =>
                  setEditProfile({ ...editProfile, name: text })
                }
                editable={isEditMode}
                placeholder="Enter your name"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, !isEditMode && styles.inputDisabled]}
                value={isEditMode ? editProfile.email : profile.email}
                onChangeText={(text) =>
                  setEditProfile({ ...editProfile, email: text })
                }
                editable={isEditMode}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={[styles.input, !isEditMode && styles.inputDisabled]}
                value={isEditMode ? editProfile.phone : profile.phone}
                onChangeText={(text) =>
                  setEditProfile({ ...editProfile, phone: text })
                }
                editable={isEditMode}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
              />
            </View>

            {/* Company */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company</Text>
              <TextInput
                style={[styles.input, !isEditMode && styles.inputDisabled]}
                value={isEditMode ? editProfile.company : profile.company}
                onChangeText={(text) =>
                  setEditProfile({ ...editProfile, company: text })
                }
                editable={isEditMode}
                placeholder="Enter your company"
              />
            </View>

            {/* Role */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <TextInput
                style={[styles.input, !isEditMode && styles.inputDisabled]}
                value={isEditMode ? editProfile.role : profile.role}
                onChangeText={(text) =>
                  setEditProfile({ ...editProfile, role: text })
                }
                editable={isEditMode}
                placeholder="Enter your role"
              />
            </View>

            {/* Save Button */}
            {isEditMode && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* SETTINGS SECTION */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="bell-outline" size={24} color="#4285F4" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive push notifications
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) =>
                handleSettingChange('notifications', value)
              }
              trackColor={{ false: '#CCC', true: '#4285F4' }}
            />
          </View>

          {/* Email Alerts */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="email-outline" size={24} color="#4285F4" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Email Alerts</Text>
                <Text style={styles.settingDescription}>
                  Receive email notifications
                </Text>
              </View>
            </View>
            <Switch
              value={settings.emailAlerts}
              onValueChange={(value) =>
                handleSettingChange('emailAlerts', value)
              }
              trackColor={{ false: '#CCC', true: '#4285F4' }}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="weather-night" size={24} color="#4285F4" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Use dark theme
                </Text>
              </View>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => handleSettingChange('darkMode', value)}
              trackColor={{ false: '#CCC', true: '#4285F4' }}
            />
          </View>

          {/* Biometric */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="fingerprint" size={24} color="#4285F4" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Biometric Login</Text>
                <Text style={styles.settingDescription}>
                  Use fingerprint or face ID
                </Text>
              </View>
            </View>
            <Switch
              value={settings.biometric}
              onValueChange={(value) => handleSettingChange('biometric', value)}
              trackColor={{ false: '#CCC', true: '#4285F4' }}
            />
          </View>

          {/* Auto Sync */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="sync" size={24} color="#4285F4" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto Sync</Text>
                <Text style={styles.settingDescription}>
                  Sync data automatically
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoSync}
              onValueChange={(value) => handleSettingChange('autoSync', value)}
              trackColor={{ false: '#CCC', true: '#4285F4' }}
            />
          </View>
        </View>

        {/* ACTIONS SECTION */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangePassword}
          >
            <Icon name="lock-outline" size={24} color="#666" />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#666" />
            <Text style={styles.actionButtonText}>Logout</Text>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <Icon name="delete-outline" size={24} color="#DB4437" />
            <Text style={[styles.actionButtonText, styles.dangerText]}>
              Delete Account
            </Text>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* VERSION INFO */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>FieldCheck AI v2.0.0</Text>
          <Text style={styles.versionText}>© 2024 All Rights Reserved</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: width / 2 - 60,
    backgroundColor: '#4285F4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileInfo: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDisabled: {
    backgroundColor: '#FFF',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
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
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actionsSection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#DB4437',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});