import AssetDoctorScreen from '../src/screens/AssetDoctorScreen';
import VoiceInspectorScreen from '../src/screens/VoiceInspectorScreen';
import InsightCardsScreen from '../src/screens/InsightCardsScreen';
import AISilenceModeScreen from '../src/screens/AISilenceModeScreen';

// In your Stack Navigator:
<Stack.Screen 
  name="AssetDoctor" 
  component={AssetDoctorScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen 
  name="VoiceInspector" 
  component={VoiceInspectorScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen 
  name="InsightCards" 
  component={InsightCardsScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen 
  name="AISilenceMode" 
  component={AISilenceModeScreen}
  options={{ headerShown: false }}
/>