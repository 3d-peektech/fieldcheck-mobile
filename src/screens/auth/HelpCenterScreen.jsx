import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HelpCenterScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How do I add a new asset?',
      answer: 'To add a new asset:\n1. Go to the Home screen\n2. Tap "Add Asset" in Quick Actions\n3. Fill in asset details (name, location, type)\n4. Take or upload photos\n5. Add QR/Barcode if available\n6. Tap "Save Asset"',
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'How do I scan an asset QR code?',
      answer: 'To scan an asset:\n1. Tap "Scan Asset" on the Home screen\n2. Allow camera permissions if prompted\n3. Point camera at QR code or barcode\n4. Asset details will load automatically\n5. View or edit asset information',
    },
    {
      id: 3,
      category: 'Inspections',
      question: 'How do I create an inspection?',
      answer: 'To create an inspection:\n1. Tap "New Inspection" from Quick Actions\n2. Select the asset to inspect\n3. Choose inspection template or custom\n4. Complete inspection checklist\n5. Add photos and notes\n6. Submit inspection report',
    },
    {
      id: 4,
      category: 'Inspections',
      question: 'Can I perform inspections offline?',
      answer: 'Yes! You can perform inspections offline:\n• All inspection data is saved locally\n• Photos are stored on your device\n• Data syncs automatically when online\n• "Using mock data" message shows offline mode',
    },
    {
      id: 5,
      category: 'AI Features',
      question: 'What is AI Analysis?',
      answer: 'AI Analysis uses computer vision to:\n• Detect asset defects automatically\n• Identify rust, corrosion, cracks\n• Measure wear and tear\n• Generate condition reports\n• Provide maintenance recommendations',
    },
    {
      id: 6,
      category: 'AI Features',
      question: 'How accurate are predictive alerts?',
      answer: 'Predictive alerts use machine learning:\n• 78-95% accuracy based on historical data\n• Improves over time with more data\n• Considers asset age, usage, environment\n• Updates every 24 hours\n• Can be customized per asset type',
    },
    {
      id: 7,
      category: 'Account',
      question: 'How do I change my language?',
      answer: 'To change language:\n1. Go to Profile tab\n2. Tap "Language"\n3. Select from: English, Spanish, French, German, Dutch\n4. App will restart with new language',
    },
    {
      id: 8,
      category: 'Account',
      question: 'How do I enable dark mode?',
      answer: 'To enable dark mode:\n1. Go to Profile tab\n2. Toggle "Dark Mode" switch\n3. Interface will update immediately\n4. Saves battery on OLED screens',
    },
    {
      id: 9,
      category: 'Subscription',
      question: 'What features are in the free trial?',
      answer: 'Free trial (3 days) includes:\n• Up to 10 assets\n• Basic inspections\n• AI Analysis (limited)\n• Standard reports\n• Email support\n\nUpgrade for unlimited assets and advanced AI features.',
    },
    {
      id: 10,
      category: 'Subscription',
      question: 'How do I upgrade my subscription?',
      answer: 'To upgrade:\n1. Go to Profile → Subscription\n2. Tap "Upgrade Now"\n3. Choose: Basic ($9/mo), Pro ($29/mo), or Enterprise\n4. Complete payment via Stripe\n5. Features unlock immediately',
    },
    {
      id: 11,
      category: 'Troubleshooting',
      question: 'Why do I see "Cannot connect to Metro" error?',
      answer: 'This development error appears because:\n• Metro bundler is not running\n• Or you\'re in production mode\n\nIn production, this error won\'t appear. For development, restart: npx expo start -c',
    },
    {
      id: 12,
      category: 'Troubleshooting',
      question: 'App shows "Using mock data" - is this normal?',
      answer: 'Yes! "Using mock data" means:\n• Backend server is not connected\n• App uses sample data for testing\n• All features work normally\n• Real backend connection coming soon\n• Your saved data is safe locally',
    },
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Quick Start Guide',
      description: 'Learn the basics in 5 minutes',
      duration: '5 min',
      icon: '🚀',
    },
    {
      id: 2,
      title: 'AI Analysis Tutorial',
      description: 'Master AI-powered inspections',
      duration: '8 min',
      icon: '🤖',
    },
    {
      id: 3,
      title: 'Advanced Reporting',
      description: 'Create professional reports',
      duration: '10 min',
      icon: '📊',
    },
  ];

  const filteredFAQs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1e3a5f', '#2c5282']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <Text style={styles.headerSubtitle}>Find answers and learn more</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Quick Contact */}
        <TouchableOpacity
          style={styles.contactBanner}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.contactIcon}>💬</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Need immediate help?</Text>
            <Text style={styles.contactSubtitle}>Contact our support team</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Video Tutorials */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🎥</Text>
          <Text style={styles.sectionTitle}>Video Tutorials</Text>
        </View>

        {tutorials.map((tutorial) => (
          <TouchableOpacity key={tutorial.id} style={styles.tutorialCard}>
            <View style={styles.tutorialIcon}>
              <Text style={styles.tutorialEmoji}>{tutorial.icon}</Text>
            </View>
            <View style={styles.tutorialContent}>
              <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
              <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{tutorial.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* FAQs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>❓</Text>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        </View>

        {filteredFAQs.map((faq) => (
          <View key={faq.id} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(faq.id)}
            >
              <View style={styles.faqTitleContainer}>
                <Text style={styles.faqCategory}>{faq.category}</Text>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedId === faq.id ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            {expandedId === faq.id && (
              <View style={styles.faqAnswer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}

        {filteredFAQs.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>
              Try different keywords or contact support
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94c5f8',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  contactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  contactIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#dbeafe',
  },
  chevron: {
    fontSize: 24,
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  tutorialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tutorialIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tutorialEmoji: {
    fontSize: 24,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  tutorialDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  durationBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  faqCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqTitleContainer: {
    flex: 1,
  },
  faqCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3b82f6',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  expandIcon: {
    fontSize: 24,
    color: '#64748b',
    marginLeft: 12,
    fontWeight: '300',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  answerText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default HelpCenterScreen;
