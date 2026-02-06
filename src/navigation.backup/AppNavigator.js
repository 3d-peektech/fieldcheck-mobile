import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================== NAVIGATORS ====================
import MainNavigator from './MainNavigator';

// ==================== AUTH SCREENS ====================
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

// ==================== SHARED SCREENS (Available from anywhere) ====================
import HelpCenterScreen from '../screens/support/HelpCenterScreen';
import TermsAndPrivacyScreen from '../screens/support/TermsAndPrivacyScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';

// ==================== THEME ====================
import colors from '../theme/colors';

const Stack = createStackNavigator();

// ==================== LOADING SCREEN ====================
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

// ==================== APP NAVIGATOR ====================
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // ==================== CHECK AUTH STATUS ====================
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user has seen onboarding
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      setHasSeenOnboarding(onboardingComplete === 'true');

      // Check if user is authenticated
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      setIsAuthenticated(!!(userToken && userId));
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== SHOW LOADING ====================
  if (isLoading) {
    return <LoadingScreen />;
  }

  // ==================== NAVIGATION STRUCTURE ====================
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        // Animations
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        }),
      }}
    >
      {/* ==================== ONBOARDING FLOW ==================== */}
      {!hasSeenOnboarding ? (
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ animationEnabled: false }}
        />
      ) : null}

      {/* ==================== AUTH FLOW ==================== */}
      {!isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{
              headerShown: true,
              headerTitle: 'Create Account',
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
            }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen}
            options={{
              headerShown: true,
              headerTitle: 'Reset Password',
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
            }}
          />
        </Stack.Group>
      ) : (
        /* ==================== MAIN APP FLOW ==================== */
        <Stack.Group>
          {/* Main Tab Navigator */}
          <Stack.Screen 
            name="Main" 
            component={MainNavigator}
            options={{ animationEnabled: false }}
          />

          {/* Modal Screens - Accessible from anywhere */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerShown: true,
                headerTitle: 'Notifications',
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
              }}
            />
            <Stack.Screen
              name="HelpCenter"
              component={HelpCenterScreen}
              options={{
                headerShown: true,
                headerTitle: 'Help Center',
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
              }}
            />
            <Stack.Screen
              name="TermsAndPrivacy"
              component={TermsAndPrivacyScreen}
              options={{
                headerShown: true,
                headerTitle: 'Legal',
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
              }}
            />
          </Stack.Group>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;