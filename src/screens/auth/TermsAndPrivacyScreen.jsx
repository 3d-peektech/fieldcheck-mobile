import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TermsAndPrivacyScreen = ({ route, navigation }) => {
  const { type = 'terms' } = route.params || {};
  const isTerms = type === 'terms';

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
        <Text style={styles.headerTitle}>
          {isTerms ? 'Terms of Service' : 'Privacy Policy'}
        </Text>
        <Text style={styles.headerSubtitle}>Last updated: February 4, 2026</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isTerms ? (
          /* Terms of Service Content */
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.paragraph}>
                By accessing and using the FieldCheck Asset Management application ("Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Description of Service</Text>
              <Text style={styles.paragraph}>
                FieldCheck provides AI-powered asset management, inspection, and maintenance tracking tools. The Service includes:
              </Text>
              <Text style={styles.bulletPoint}>• Asset tracking and management</Text>
              <Text style={styles.bulletPoint}>• AI-powered analysis and predictions</Text>
              <Text style={styles.bulletPoint}>• Inspection scheduling and reporting</Text>
              <Text style={styles.bulletPoint}>• Mobile and web access</Text>
              <Text style={styles.bulletPoint}>• Cloud storage for data</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
              <Text style={styles.paragraph}>You agree to:</Text>
              <Text style={styles.bulletPoint}>• Provide accurate and complete information</Text>
              <Text style={styles.bulletPoint}>• Maintain the security of your account</Text>
              <Text style={styles.bulletPoint}>• Use the Service in compliance with applicable laws</Text>
              <Text style={styles.bulletPoint}>• Not misuse or attempt to gain unauthorized access</Text>
              <Text style={styles.bulletPoint}>• Not interfere with the Service's operation</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Subscription and Payment</Text>
              <Text style={styles.paragraph}>
                Subscriptions are billed monthly or annually. Payment is processed securely through Stripe. You may cancel your subscription at any time. Refunds are available within 30 days of purchase.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Data Ownership</Text>
              <Text style={styles.paragraph}>
                You retain all rights to your data. We do not claim ownership of any content you upload. You grant us a license to use your data solely to provide and improve the Service.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
              <Text style={styles.paragraph}>
                The Service is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from use of the Service. Our total liability is limited to the amount you paid in the last 12 months.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Termination</Text>
              <Text style={styles.paragraph}>
                We may terminate or suspend your account for violation of these terms. You may terminate your account at any time from account settings. Upon termination, your data will be deleted after 30 days.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
              <Text style={styles.paragraph}>
                We may modify these terms at any time. We will notify you of significant changes via email or in-app notification. Continued use after changes constitutes acceptance.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Contact Information</Text>
              <Text style={styles.paragraph}>
                For questions about these terms, contact us:
              </Text>
              <Text style={styles.contactText}>📧 3dpeektech@consultant.com</Text>
              <Text style={styles.contactText}>📞 +31 630 165 666</Text>
              <Text style={styles.contactText}>📍 Calle Tajonar, Pamplona, Navarra, Spain</Text>
            </View>
          </View>
        ) : (
          /* Privacy Policy Content */
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.paragraph}>We collect information you provide directly:</Text>
              <Text style={styles.bulletPoint}>• Account information (name, email, company)</Text>
              <Text style={styles.bulletPoint}>• Asset data and inspection records</Text>
              <Text style={styles.bulletPoint}>• Photos and documents you upload</Text>
              <Text style={styles.bulletPoint}>• Usage data and analytics</Text>
              <Text style={styles.bulletPoint}>• Device information and IP address</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.paragraph}>We use your information to:</Text>
              <Text style={styles.bulletPoint}>• Provide and improve the Service</Text>
              <Text style={styles.bulletPoint}>• Process AI analysis and predictions</Text>
              <Text style={styles.bulletPoint}>• Send notifications and updates</Text>
              <Text style={styles.bulletPoint}>• Provide customer support</Text>
              <Text style={styles.bulletPoint}>• Prevent fraud and abuse</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
              <Text style={styles.paragraph}>
                Your data is stored on secure cloud servers with encryption at rest and in transit. We implement industry-standard security measures including:
              </Text>
              <Text style={styles.bulletPoint}>• 256-bit SSL/TLS encryption</Text>
              <Text style={styles.bulletPoint}>• Regular security audits</Text>
              <Text style={styles.bulletPoint}>• Access controls and authentication</Text>
              <Text style={styles.bulletPoint}>• Automated backups</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Data Sharing</Text>
              <Text style={styles.paragraph}>
                We do not sell your personal data. We may share data with:
              </Text>
              <Text style={styles.bulletPoint}>• Service providers (hosting, payment processing)</Text>
              <Text style={styles.bulletPoint}>• Team members you authorize</Text>
              <Text style={styles.bulletPoint}>• Law enforcement if required by law</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Your Rights</Text>
              <Text style={styles.paragraph}>You have the right to:</Text>
              <Text style={styles.bulletPoint}>• Access your data</Text>
              <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
              <Text style={styles.bulletPoint}>• Delete your data</Text>
              <Text style={styles.bulletPoint}>• Export your data</Text>
              <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
              <Text style={styles.paragraph}>
                We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized features. You can control cookies through your browser settings.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
              <Text style={styles.paragraph}>
                The Service is not intended for children under 13. We do not knowingly collect information from children. If you believe we have collected data from a child, please contact us immediately.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
              <Text style={styles.paragraph}>
                Your data may be transferred to and stored in countries outside your residence. We ensure appropriate safeguards are in place for international transfers.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Changes to Privacy Policy</Text>
              <Text style={styles.paragraph}>
                We may update this policy periodically. We will notify you of significant changes. Your continued use constitutes acceptance of the updated policy.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Contact Us</Text>
              <Text style={styles.paragraph}>
                For privacy-related questions or to exercise your rights:
              </Text>
              <Text style={styles.contactText}>📧 3dpeektech@consultant.com</Text>
              <Text style={styles.contactText}>📞 +31 630 165 666</Text>
              <Text style={styles.contactText}>📍 Calle Tajonar, Pamplona, Navarra, Spain</Text>
            </View>
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
    fontSize: 13,
    color: '#94c5f8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginLeft: 8,
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#3b82f6',
    lineHeight: 24,
  },
});

export default TermsAndPrivacyScreen;
