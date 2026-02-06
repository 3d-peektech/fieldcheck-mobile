import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import only the screens we've created
import FinancialPredictorScreen from '../screens/ai/FinancialPredictorScreen';
import SmartAssetDoctorScreen from '../screens/ai/SmartAssetDoctorScreen';
import VoiceInspectorScreen from '../screens/ai/VoiceInspectorScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator with our 3 AI screens
const AITabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'FinancialPredictor') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'SmartAssetDoctor') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'VoiceInspector') {
            iconName = focused ? 'mic' : 'mic-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="FinancialPredictor" 
        component={FinancialPredictorScreen}
        options={{ title: 'Financial AI' }}
      />
      <Tab.Screen 
        name="SmartAssetDoctor" 
        component={SmartAssetDoctorScreen}
        options={{ title: 'Asset Doctor' }}
      />
      <Tab.Screen 
        name="VoiceInspector" 
        component={VoiceInspectorScreen}
        options={{ title: 'Voice' }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#10b981',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="AIFeatures" 
        component={AITabNavigator}
        options={{ 
          title: 'FieldCheck AI',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;