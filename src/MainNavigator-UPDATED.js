import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import existing screens
import Dashboard from '../screens/home/Dashboard';
import InspectionsList from '../screens/inspections/InspectionsList';
import AssetsList from '../screens/assets/AssetsList';
import AIAnalysis from '../screens/inspections/AIAnalysis';
import ScanAsset from '../screens/assets/ScanAsset';
import NewInspection from '../screens/inspections/NewInspection';
import AddAsset from '../screens/assets/AddAsset';
import Profile from '../screens/profile/Profile';

// NEW AI FEATURES 🚀
import SmartAssetDoctorScreen from '../screens/ai/SmartAssetDoctorScreen';
import VoiceInspectorScreen from '../screens/ai/VoiceInspectorScreen';
import FinancialPredictorScreen from '../screens/ai/FinancialPredictorScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator (UPDATED with AI Features)
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DashboardScreen" 
        component={Dashboard}
        options={{ headerShown: false }}
      />
      
      {/* Existing screens */}
      <Stack.Screen 
        name="AIAnalysis" 
        component={AIAnalysis}
        options={{ title: 'AI Analysis' }}
      />
      <Stack.Screen 
        name="ScanAsset" 
        component={ScanAsset}
        options={{ title: 'Scan Asset' }}
      />
      <Stack.Screen 
        name="NewInspection" 
        component={NewInspection}
        options={{ title: 'New Inspection' }}
      />
      <Stack.Screen 
        name="AddAsset" 
        component={AddAsset}
        options={{ title: 'Add Asset' }}
      />
      
      {/* NEW AI FEATURES 🚀 */}
      <Stack.Screen 
        name="SmartAssetDoctor" 
        component={SmartAssetDoctorScreen}
        options={{
          title: '🔬 AI Asset Doctor',
          headerStyle: { 
            backgroundColor: '#8b5cf6',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: { 
            fontWeight: 'bold',
            fontSize: 18,
          }
        }}
      />
      <Stack.Screen 
        name="VoiceInspector" 
        component={VoiceInspectorScreen}
        options={{
          title: '🎤 Voice Inspector',
          headerStyle: { 
            backgroundColor: '#3b82f6',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: { 
            fontWeight: 'bold',
            fontSize: 18,
          }
        }}
      />
      <Stack.Screen 
        name="FinancialPredictor" 
        component={FinancialPredictorScreen}
        options={{
          title: '💰 Financial AI',
          headerStyle: { 
            backgroundColor: '#10b981',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: { 
            fontWeight: 'bold',
            fontSize: 18,
          }
        }}
      />
    </Stack.Navigator>
  );
};

// Assets Stack Navigator (AI features also accessible here)
const AssetsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AssetsListScreen" 
        component={AssetsList}
        options={{ title: 'Assets' }}
      />
      <Stack.Screen 
        name="AddAsset" 
        component={AddAsset}
        options={{ title: 'Add Asset' }}
      />
      {/* AI Doctor also accessible from Assets */}
      <Stack.Screen 
        name="SmartAssetDoctor" 
        component={SmartAssetDoctorScreen}
        options={{
          title: '🔬 AI Asset Doctor',
          headerStyle: { backgroundColor: '#8b5cf6' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

// Inspections Stack Navigator
const InspectionsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InspectionsListScreen" 
        component={InspectionsList}
        options={{ title: 'Inspections' }}
      />
      <Stack.Screen 
        name="NewInspection" 
        component={NewInspection}
        options={{ title: 'New Inspection' }}
      />
      {/* Voice Inspector accessible from Inspections */}
      <Stack.Screen 
        name="VoiceInspector" 
        component={VoiceInspectorScreen}
        options={{
          title: '🎤 Voice Inspector',
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Assets" 
        component={AssetsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📦</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Inspections" 
        component={InspectionsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📋</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
