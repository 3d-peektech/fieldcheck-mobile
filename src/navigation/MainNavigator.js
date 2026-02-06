import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View, Text } from 'react-native';
import colors from '../theme/colors';

// ==================== SCREEN IMPORTS ====================
// Home Screens
import Dashboard from '../screens/home/Dashboard';

// Assets Screens
import AssetsList from '../screens/assets/AssetsList';
import AssetDetails from '../screens/assets/AssetDetails';
import AddAsset from '../screens/assets/AddAsset';
import EditAsset from '../screens/assets/EditAsset';
import ScanAsset from '../screens/assets/ScanAsset';
import AssetHistory from '../screens/assets/AssetHistory';
import AssetQRCode from '../screens/assets/AssetQRCode';

// Inspections Screens
import InspectionsList from '../screens/inspections/InspectionsList';
import InspectionDetails from '../screens/inspections/InspectionDetails';
import NewInspection from '../screens/inspections/NewInspection';
import EditInspection from '../screens/inspections/EditInspection';
import AIAnalysis from '../screens/inspections/AIAnalysis';

// Profile Screens
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import ExportDataScreen from '../screens/Profile/ExportDataScreen';

// Financial Screens
import BillingScreen from '../screens/financial/BillingScreen';
import InvoicesScreen from '../screens/financial/InvoicesScreen';
import PaymentMethodsScreen from '../screens/financial/PaymentMethodsScreen';

// Payment Screens
import SubscriptionScreen from '../screens/payment/SubscriptionScreen';
import PaymentSuccessScreen from '../screens/payment/PaymentSuccessScreen';

// ==================== NAVIGATORS ====================
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ==================== SHARED STACK OPTIONS ====================
const defaultStackOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
  },
  headerBackTitleVisible: false,
  cardStyle: { backgroundColor: colors.background },
  // Smooth transitions
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};

// ==================== HOME STACK ====================
const HomeStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="DashboardScreen"
      component={Dashboard}
      options={{
        headerShown: false,
      }}
    />
    
    {/* Quick Actions from Dashboard */}
    <Stack.Screen
      name="ScanAsset"
      component={ScanAsset}
      options={{
        headerTitle: 'Scan QR Code',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="NewInspection"
      component={NewInspection}
      options={{
        headerTitle: 'New Inspection',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AIAnalysis"
      component={AIAnalysis}
      options={{
        headerTitle: '🤖 AI Analysis',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AddAsset"
      component={AddAsset}
      options={{
        headerTitle: 'Add Asset',
        headerShown: true,
      }}
    />

    {/* Deep Linked Screens */}
    <Stack.Screen
      name="AssetDetails"
      component={AssetDetails}
      options={{
        headerTitle: 'Asset Details',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="InspectionDetails"
      component={InspectionDetails}
      options={{
        headerTitle: 'Inspection Details',
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

// ==================== ASSETS STACK ====================
const AssetsStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="AssetsListScreen"
      component={AssetsList}
      options={{
        headerTitle: 'Assets',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AssetDetails"
      component={AssetDetails}
      options={{
        headerTitle: 'Asset Details',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AddAsset"
      component={AddAsset}
      options={{
        headerTitle: 'Add New Asset',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="EditAsset"
      component={EditAsset}
      options={{
        headerTitle: 'Edit Asset',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ScanAsset"
      component={ScanAsset}
      options={{
        headerTitle: 'Scan QR Code',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AssetHistory"
      component={AssetHistory}
      options={{
        headerTitle: 'Asset History',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AssetQRCode"
      component={AssetQRCode}
      options={{
        headerTitle: 'QR Code',
        headerShown: true,
      }}
    />
    
    {/* Cross-navigation */}
    <Stack.Screen
      name="NewInspection"
      component={NewInspection}
      options={{
        headerTitle: 'New Inspection',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="InspectionDetails"
      component={InspectionDetails}
      options={{
        headerTitle: 'Inspection Details',
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

// ==================== INSPECTIONS STACK ====================
const InspectionsStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="InspectionsListScreen"
      component={InspectionsList}
      options={{
        headerTitle: 'Inspections',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="InspectionDetails"
      component={InspectionDetails}
      options={{
        headerTitle: 'Inspection Details',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="NewInspection"
      component={NewInspection}
      options={{
        headerTitle: 'New Inspection',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="EditInspection"
      component={EditInspection}
      options={{
        headerTitle: 'Edit Inspection',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AIAnalysis"
      component={AIAnalysis}
      options={{
        headerTitle: '🤖 AI Analysis',
        headerShown: true,
      }}
    />
    
    {/* Cross-navigation */}
    <Stack.Screen
      name="AssetDetails"
      component={AssetDetails}
      options={{
        headerTitle: 'Asset Details',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ScanAsset"
      component={ScanAsset}
      options={{
        headerTitle: 'Scan Asset',
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

// ==================== PROFILE STACK ====================
const ProfileStack = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        headerTitle: 'Settings',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerTitle: 'Edit Profile',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{
        headerTitle: 'Change Password',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ExportData"
      component={ExportDataScreen}
      options={{
        headerTitle: 'Export Data',
        headerShown: true,
      }}
    />
    
    {/* Financial Screens */}
    <Stack.Screen
      name="Subscription"
      component={SubscriptionScreen}
      options={{
        headerTitle: 'Subscription',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Billing"
      component={BillingScreen}
      options={{
        headerTitle: 'Billing',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Invoices"
      component={InvoicesScreen}
      options={{
        headerTitle: 'Invoices',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="PaymentMethods"
      component={PaymentMethodsScreen}
      options={{
        headerTitle: 'Payment Methods',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="PaymentSuccess"
      component={PaymentSuccessScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

// ==================== CUSTOM TAB BAR BADGE ====================
const TabBarBadge = ({ count }) => {
  if (!count || count === 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

// ==================== MAIN TAB NAVIGATOR ====================
const MainNavigator = () => {
  // You can get notification count from context/redux
  const notificationCount = 0; // TODO: Connect to notification system

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Assets':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'Inspections':
              iconName = focused ? 'clipboard' : 'clipboard-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 65,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        // Haptic feedback on tab press (iOS)
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            onPress={(e) => {
              if (Platform.OS === 'ios') {
                // You can add haptic feedback here
                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              props.onPress?.(e);
            }}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
        }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsStack}
        options={{
          title: 'Assets',
        }}
      />
      <Tab.Screen
        name="Inspections"
        component={InspectionsStack}
        options={{
          title: 'Inspections',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default MainNavigator;