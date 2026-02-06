import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Spanish', 'French', 'German', 'Dutch'];

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    Alert.alert('Dark Mode', `Dark mode ${!isDarkMode ? 'enabled' : 'disabled'}`);
    // Here you would implement actual dark mode theme switching
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert('Notifications', `Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      languages.map(lang => ({
        text: lang,
        onPress: () => {
          setSelectedLanguage(lang);
          Alert.alert('Language Changed', `Language set to ${lang}`);
        },
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how to contact us:',
      [
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+31630165666'),
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:3dpeektech@consultant.com'),
        },
        {
          text: 'WhatsApp',
          onPress: () => Linking.openURL('https://wa.me/31630165666'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleHelpCenter = () => {
    navigation.navigate('HelpCenter');
  };

  const handleTerms = () => {
    navigation.navigate('TermsAndPrivacy', { type: 'terms' });
  };

  const handlePrivacy = () => {
    navigation.navigate('TermsAndPrivacy', { type: 'privacy' });
  };

  const handleUpgrade = () => {
    navigation.navigate('Subscription');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <LinearGradient
        colors={isDarkMode ? ['#1e293b', '#0f172a'] : ['#1e3a5f', '#2c5282']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>👤</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Edit Profile</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('CompanySettings')}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🏢</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Company Settings</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🔐</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Change Password</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Preferences</Text>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🔔</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f4f5'}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🌙</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
              thumbColor={isDarkMode ? '#ffffff' : '#f4f4f5'}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleLanguageChange}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🌐</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Language</Text>
            <Text style={styles.languageText}>{selectedLanguage}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Subscription Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Subscription</Text>
        </View>

        <TouchableOpacity
          style={[styles.subscriptionCard, isDarkMode && styles.darkSection]}
          onPress={handleUpgrade}
        >
          <View style={styles.subscriptionContent}>
            <Text style={[styles.subscriptionTitle, isDarkMode && styles.darkText]}>Free Trial</Text>
            <View style={styles.daysLeftBadge}>
              <Text style={styles.daysLeftText}>3 days left</Text>
            </View>
          </View>
          <Text style={styles.subscriptionSubtitle}>Upgrade to unlock all features</Text>
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            style={styles.upgradeButton}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Support Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Support</Text>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <TouchableOpacity style={styles.menuItem} onPress={handleHelpCenter}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>❓</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Help Center</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleContactSupport}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>📧</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Contact Support</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>📄</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Terms of Service</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🔒</Text>
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={[styles.contactCard, isDarkMode && styles.darkSection]}>
          <Text style={[styles.contactTitle, isDarkMode && styles.darkText]}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={[styles.contactText, isDarkMode && styles.darkText]}>+31 630 165 666</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📧</Text>
            <Text style={[styles.contactText, isDarkMode && styles.darkText]}>3dpeektech@consultant.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={[styles.contactText, isDarkMode && styles.darkText]}>
              Calle Tajonar, Pamplona, Navarra, Spain
            </Text>
          </View>
        </View>

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
  darkContainer: {
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: '#1e293b',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  darkText: {
    color: '#f1f5f9',
  },
  chevron: {
    fontSize: 24,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 4,
  },
  subscriptionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subscriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  daysLeftBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysLeftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  subscriptionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  upgradeButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  contactCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
});

export default ProfileScreen;
