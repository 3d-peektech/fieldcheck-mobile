import SmartAssetDoctorScreen from '../screens/ai/SmartAssetDoctorScreen';
import VoiceInspectorScreen from '../screens/ai/VoiceInspectorScreen';
import FinancialPredictorScreen from '../screens/ai/FinancialPredictorScreen';

// En tu Tab Navigator:
<Tab.Screen 
  name="AssetDoctor" 
  component={SmartAssetDoctorScreen}
  options={{
    title: 'Asset Doctor',
    tabBarIcon: ({ color }) => (
      <Ionicons name="medical" size={24} color={color} />
    ),
  }}
/>

<Tab.Screen 
  name="VoiceInspector" 
  component={VoiceInspectorScreen}
  options={{
    title: 'Voice Inspector',
    tabBarIcon: ({ color }) => (
      <Ionicons name="mic" size={24} color={color} />
    ),
  }}
/>

<Tab.Screen 
  name="FinancialAI" 
  component={FinancialPredictorScreen}
  options={{
    title: 'Financial AI',
    tabBarIcon: ({ color }) => (
      <Ionicons name="cash" size={24} color={color} />
    ),
  }}
/>