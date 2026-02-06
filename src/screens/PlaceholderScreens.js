import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

// ==================== PLACEHOLDER SCREEN COMPONENT ====================
const PlaceholderScreen = ({ title, icon, description, navigation }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={80} color={colors.primary} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation?.goBack()}
    >
      <Text style={styles.buttonText}>Go Back</Text>
    </TouchableOpacity>
  </View>
);

// ==================== ASSET SCREENS ====================
export const AssetDetails = ({ navigation }) => (
  <PlaceholderScreen
    title="Asset Details"
    icon="cube"
    description="This screen will show detailed information about a specific asset."
    navigation={navigation}
  />
);

export const EditAsset = ({ navigation }) => (
  <PlaceholderScreen
    title="Edit Asset"
    icon="create"
    description="This screen will allow editing asset information."
    navigation={navigation}
  />
);

export const AssetHistory = ({ navigation }) => (
  <PlaceholderScreen
    title="Asset History"
    icon="time"
    description="This screen will show the complete history of an asset."
    navigation={navigation}
  />
);

export const AssetQRCode = ({ navigation }) => (
  <PlaceholderScreen
    title="Asset QR Code"
    icon="qr-code"
    description="This screen will display and manage QR codes for assets."
    navigation={navigation}
  />
);

// ==================== INSPECTION SCREENS ====================
export const InspectionDetails = ({ navigation }) => (
  <PlaceholderScreen
    title="Inspection Details"
    icon="clipboard"
    description="This screen will show detailed information about a specific inspection."
    navigation={navigation}
  />
);

export const EditInspection = ({ navigation }) => (
  <PlaceholderScreen
    title="Edit Inspection"
    icon="create"
    description="This screen will allow editing inspection details."
    navigation={navigation}
  />
);

// ==================== AUTH SCREENS ====================
export const OnboardingScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Onboarding"
    icon="information-circle"
    description="This screen will introduce new users to the app."
    navigation={navigation}
  />
);

export const ForgotPasswordScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Forgot Password"
    icon="key"
    description="This screen will help users reset their password."
    navigation={navigation}
  />
);

// ==================== SUPPORT SCREENS ====================
export const HelpCenterScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Help Center"
    icon="help-circle"
    description="This screen will provide help and support resources."
    navigation={navigation}
  />
);

export const TermsAndPrivacyScreen = ({ navigation, route }) => {
  const tab = route?.params?.tab || 'terms';
  return (
    <PlaceholderScreen
      title={tab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
      icon="document-text"
      description={`This screen will display the ${tab === 'terms' ? 'terms of service' : 'privacy policy'}.`}
      navigation={navigation}
    />
  );
};

export const NotificationsScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Notifications"
    icon="notifications"
    description="This screen will show all user notifications."
    navigation={navigation}
  />
);

// ==================== FINANCIAL SCREENS ====================
export const BillingScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Billing"
    icon="card"
    description="This screen will manage billing information."
    navigation={navigation}
  />
);

export const InvoicesScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Invoices"
    icon="receipt"
    description="This screen will display invoice history."
    navigation={navigation}
  />
);

export const PaymentMethodsScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Payment Methods"
    icon="card"
    description="This screen will manage payment methods."
    navigation={navigation}
  />
);

// ==================== PAYMENT SCREENS ====================
export const SubscriptionScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Subscription"
    icon="pricetag"
    description="This screen will manage subscription plans."
    navigation={navigation}
  />
);

export const PaymentSuccessScreen = ({ navigation }) => (
  <PlaceholderScreen
    title="Payment Success"
    icon="checkmark-circle"
    description="This screen confirms successful payment."
    navigation={navigation}
  />
);

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});