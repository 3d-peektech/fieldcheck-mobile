// App.tsx (o MainNavigator.tsx)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens (usa UNA sola ruta coherente)
import MainMenuScreen from './src/screens/MainMenuScreen';
import RealTimeDashboardSimple from './src/screens/RealTimeDashboardSimple';
import ProfileSettingsProScreen from './src/screens/ProfileSettingsProScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainMenu"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen
          name="MainMenu"
          component={MainMenuScreen}
        />

        <Stack.Screen
          name="Dashboard"
          component={RealTimeDashboardSimple}
        />

        <Stack.Screen
          name="ProfileSettings"
          component={ProfileSettingsProScreen}
        />

        {/*
        🔌 FUTURAS PANTALLAS
        <Stack.Screen name="FinancialAI" component={FinancialAIScreen} />
        <Stack.Screen name="AssetDoctor" component={AssetDoctorScreen} />
        <Stack.Screen name="VoiceInspector" component={VoiceInspectorScreen} />
        <Stack.Screen name="Reports" component={ReportsExportScreen} />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
