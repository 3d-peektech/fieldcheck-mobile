import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HelpCenterScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.header}>
        <Text style={styles.headerTitle}>❓ Help Center</Text>
        <Text style={styles.headerSubtitle}>Get support and answers</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpIcon}>📱</Text>
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Getting Started</Text>
            <Text style={styles.helpDescription}>Learn the basics of FieldCheck</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpIcon}>🔧</Text>
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Troubleshooting</Text>
            <Text style={styles.helpDescription}>Common issues and solutions</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpIcon}>💬</Text>
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Contact Support</Text>
            <Text style={styles.helpDescription}>Get in touch with our team</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
  },
  section: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  helpIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default HelpCenterScreen;