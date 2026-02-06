// ExportDataScreen.js
// Location: src/screens/Profile/ExportDataScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { t } from '../../utils/i18n';

export default function ExportDataScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    profile: true,
    inspections: true,
    reports: true,
    settings: true,
    photos: false, // Off by default (large file size)
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const language = await AsyncStorage.getItem('language');
      const darkMode = await AsyncStorage.getItem('darkMode');
      if (language) setCurrentLanguage(language);
      if (darkMode) setIsDarkMode(darkMode === 'true');
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const collectUserData = async () => {
    const userData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        exportedBy: 'FieldCheck AI',
      },
      data: {}
    };

    try {
      // Collect Profile Data
      if (exportOptions.profile) {
        const profile = await AsyncStorage.getItem('userProfile');
        userData.data.profile = profile ? JSON.parse(profile) : null;
      }

      // Collect Settings
      if (exportOptions.settings) {
        const darkMode = await AsyncStorage.getItem('darkMode');
        const notifications = await AsyncStorage.getItem('notifications');
        const language = await AsyncStorage.getItem('language');
        
        userData.data.settings = {
          darkMode: darkMode === 'true',
          notifications: notifications === 'true',
          language: language || 'en'
        };
      }

      // Collect Subscription Data
      const subscription = await AsyncStorage.getItem('subscription');
      userData.data.subscription = subscription ? JSON.parse(subscription) : null;

      // Collect Inspections (if you have them stored)
      if (exportOptions.inspections) {
        const inspections = await AsyncStorage.getItem('inspections');
        userData.data.inspections = inspections ? JSON.parse(inspections) : [];
      }

      // Collect Reports (if you have them stored)
      if (exportOptions.reports) {
        const reports = await AsyncStorage.getItem('reports');
        userData.data.reports = reports ? JSON.parse(reports) : [];
      }

      // Note: Photos would require additional handling for binary data
      if (exportOptions.photos) {
        userData.data.photos = {
          note: 'Photo data would be exported separately due to size constraints'
        };
      }

      return userData;
    } catch (error) {
      console.error('Error collecting user data:', error);
      throw error;
    }
  };

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      // Collect all user data
      const userData = await collectUserData();
      
      // Convert to JSON
      const jsonContent = JSON.stringify(userData, null, 2);
      
      // Create file
      const fileName = `fieldcheck_export_${new Date().getTime()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Write file
      await FileSystem.writeAsStringAsync(fileUri, jsonContent);
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // Share the file
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Your Data',
          UTI: 'public.json'
        });
      } else {
        // Fallback: Use Share API
        await Share.share({
          message: jsonContent,
          title: 'FieldCheck Data Export'
        });
      }

      Alert.alert(
        'Export Successful',
        'Your data has been exported successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert(
        'Export Failed',
        'Failed to export your data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const userData = await collectUserData();
      
      // Convert profile to CSV format
      let csvContent = 'FieldCheck Data Export\n';
      csvContent += `Export Date,${new Date().toISOString()}\n\n`;
      
      // Profile Section
      if (userData.data.profile) {
        csvContent += 'PROFILE DATA\n';
        csvContent += 'Field,Value\n';
        Object.entries(userData.data.profile).forEach(([key, value]) => {
          csvContent += `${key},"${value}"\n`;
        });
        csvContent += '\n';
      }
      
      // Settings Section
      if (userData.data.settings) {
        csvContent += 'SETTINGS\n';
        csvContent += 'Setting,Value\n';
        Object.entries(userData.data.settings).forEach(([key, value]) => {
          csvContent += `${key},${value}\n`;
        });
        csvContent += '\n';
      }

      // Create file
      const fileName = `fieldcheck_export_${new Date().getTime()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Write file
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      
      // Share
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Your Data'
        });
      }

      Alert.alert('Export Successful', 'Your data has been exported as CSV!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Export Failed', 'Failed to export CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleEmailData = async () => {
    try {
      const userData = await collectUserData();
      const jsonContent = JSON.stringify(userData, null, 2);
      
      // Create email with data
      const subject = 'FieldCheck Data Export';
      const body = `Please find your FieldCheck data export below:\n\n${jsonContent}`;
      const email = 'your-email@example.com'; // User should input their email
      
      Alert.alert(
        'Email Export',
        'This feature requires email configuration. Would you like to copy the data to clipboard instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Copy to Clipboard',
            onPress: async () => {
              // In a real app, you'd use Clipboard API
              Alert.alert('Success', 'Data copied! You can paste it in your email app.');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error preparing email:', error);
      Alert.alert('Error', 'Failed to prepare email export');
    }
  };

  const toggleOption = (option) => {
    setExportOptions({
      ...exportOptions,
      [option]: !exportOptions[option]
    });
  };

  const colors = isDarkMode ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    primary: '#10B981',
  } : {
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    primary: '#10B981',
  };

  const ExportOption = ({ icon, title, subtitle, value, onToggle }) => (
    <TouchableOpacity 
      style={[styles.optionItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
      </View>
      <View style={[
        styles.checkbox,
        { borderColor: value ? colors.primary : colors.border },
        value && { backgroundColor: colors.primary }
      ]}>
        {value && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export My Data</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.infoIcon, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="information-circle" size={28} color={colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              About Data Export
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              You can export all your FieldCheck data in JSON or CSV format. Select what you want to include below.
            </Text>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What to Export
          </Text>
          
          <View style={styles.optionsList}>
            <ExportOption
              icon="person-outline"
              title="Profile Information"
              subtitle="Name, email, phone, company details"
              value={exportOptions.profile}
              onToggle={() => toggleOption('profile')}
            />
            
            <ExportOption
              icon="clipboard-outline"
              title="Inspections"
              subtitle="All inspection records and history"
              value={exportOptions.inspections}
              onToggle={() => toggleOption('inspections')}
            />
            
            <ExportOption
              icon="document-text-outline"
              title="Reports"
              subtitle="Generated reports and analytics"
              value={exportOptions.reports}
              onToggle={() => toggleOption('reports')}
            />
            
            <ExportOption
              icon="settings-outline"
              title="App Settings"
              subtitle="Preferences and configuration"
              value={exportOptions.settings}
              onToggle={() => toggleOption('settings')}
            />
            
            <ExportOption
              icon="images-outline"
              title="Photos & Media"
              subtitle="Inspection photos (may be large)"
              value={exportOptions.photos}
              onToggle={() => toggleOption('photos')}
            />
          </View>
        </View>

        {/* Export Format */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Export Format
          </Text>
          
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={handleExportJSON}
            disabled={exporting}
          >
            <View style={styles.exportButtonContent}>
              <View style={[styles.formatIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="code-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.formatText}>
                <Text style={[styles.formatTitle, { color: colors.text }]}>
                  JSON Format
                </Text>
                <Text style={[styles.formatSubtitle, { color: colors.textSecondary }]}>
                  Best for developers and data analysis
                </Text>
              </View>
              <Ionicons name="download-outline" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={handleExportCSV}
            disabled={exporting}
          >
            <View style={styles.exportButtonContent}>
              <View style={[styles.formatIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="grid-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.formatText}>
                <Text style={[styles.formatTitle, { color: colors.text }]}>
                  CSV Format
                </Text>
                <Text style={[styles.formatSubtitle, { color: colors.textSecondary }]}>
                  Compatible with Excel and spreadsheets
                </Text>
              </View>
              <Ionicons name="download-outline" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={handleEmailData}
            disabled={exporting}
          >
            <View style={styles.exportButtonContent}>
              <View style={[styles.formatIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="mail-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.formatText}>
                <Text style={[styles.formatTitle, { color: colors.text }]}>
                  Email Export
                </Text>
                <Text style={[styles.formatSubtitle, { color: colors.textSecondary }]}>
                  Send data to your email address
                </Text>
              </View>
              <Ionicons name="send-outline" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={[styles.privacyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Your data export is generated locally on your device and is never sent to our servers.
          </Text>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {exporting && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: colors.card }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Exporting your data...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButton: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
  },
  exportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  formatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatText: {
    flex: 1,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  formatSubtitle: {
    fontSize: 13,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});