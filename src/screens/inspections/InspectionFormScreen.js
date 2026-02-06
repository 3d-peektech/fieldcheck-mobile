import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

const InspectionFormScreen = ({ route }) => {
  const { inspectionId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inspection Form</Text>
      <Text style={styles.subtitle}>ID: {inspectionId}</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default InspectionFormScreen;