import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: February 4, 2026</Text>

          <Text style={styles.introduction}>
            FieldCheck ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          
          <Text style={styles.subTitle}>1.1 Personal Information</Text>
          <Text style={styles.paragraph}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={styles.bulletPoint}>• Name and email address</Text>
          <Text style={styles.bulletPoint}>• Company name and job title</Text>
          <Text style={styles.bulletPoint}>• Phone number</Text>
          <Text style={styles.bulletPoint}>• Payment information (processed securely through Stripe)</Text>
          <Text style={styles.bulletPoint}>• Profile photo (optional)</Text>

          <Text style={styles.subTitle}>1.2 Asset and Inspection Data</Text>
          <Text style={styles.paragraph}>
            When you use our service, we collect:
          </Text>
          <Text style={styles.bulletPoint}>• Asset information (names, locations, serial numbers)</Text>
          <Text style={styles.bulletPoint}>• Inspection reports and results</Text>
          <Text style={styles.bulletPoint}>• Photos and images uploaded for AI analysis</Text>
          <Text style={styles.bulletPoint}>• QR codes and barcode data</Text>

          <Text style={styles.subTitle}>1.3 Usage Data</Text>
          <Text style={styles.paragraph}>
            We automatically collect certain information about your device and how you interact with our app:
          </Text>
          <Text style={styles.bulletPoint}>• Device type and operating system</Text>
          <Text style={styles.bulletPoint}>• App usage statistics</Text>
          <Text style={styles.bulletPoint}>• Crash reports and error logs</Text>
          <Text style={styles.bulletPoint}>• IP address and location data (if permitted)</Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide and maintain our Service</Text>
          <Text style={styles.bulletPoint}>• Process your transactions and manage subscriptions</Text>
          <Text style={styles.bulletPoint}>• Perform AI analysis on uploaded images</Text>
          <Text style={styles.bulletPoint}>• Send you technical notices and support messages</Text>
          <Text style={styles.bulletPoint}>• Respond to your comments and questions</Text>
          <Text style={styles.bulletPoint}>• Improve our Service and develop new features</Text>
          <Text style={styles.bulletPoint}>• Detect and prevent fraud or abuse</Text>

          <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information:
          </Text>
          <Text style={styles.bulletPoint}>• Data is encrypted in transit using SSL/TLS</Text>
          <Text style={styles.bulletPoint}>• Data at rest is encrypted using AES-256</Text>
          <Text style={styles.bulletPoint}>• Access to personal data is restricted to authorized personnel only</Text>
          <Text style={styles.bulletPoint}>• Regular security audits and penetration testing</Text>
          <Text style={styles.bulletPoint}>• Data is stored on secure servers in [Your Region]</Text>

          <Text style={styles.sectionTitle}>4. Data Sharing and Disclosure</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </Text>
          <Text style={styles.bulletPoint}>• With your consent or at your direction</Text>
          <Text style={styles.bulletPoint}>• With service providers who perform services on our behalf (e.g., Stripe for payments)</Text>
          <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
          <Text style={styles.bulletPoint}>• To protect the rights, property, or safety of FieldCheck or others</Text>
          <Text style={styles.bulletPoint}>• In connection with a merger, sale, or acquisition</Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the following rights regarding your personal data:
          </Text>
          <Text style={styles.bulletPoint}>• Right to access: Request a copy of your personal data</Text>
          <Text style={styles.bulletPoint}>• Right to rectification: Correct inaccurate or incomplete data</Text>
          <Text style={styles.bulletPoint}>• Right to erasure: Request deletion of your data</Text>
          <Text style={styles.bulletPoint}>• Right to restrict processing: Limit how we use your data</Text>
          <Text style={styles.bulletPoint}>• Right to data portability: Receive your data in a structured format</Text>
          <Text style={styles.bulletPoint}>• Right to object: Object to certain processing of your data</Text>
          <Text style={styles.bulletPoint}>• Right to withdraw consent: At any time</Text>

          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide you with our services</Text>
          <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
          <Text style={styles.bulletPoint}>• Resolve disputes</Text>
          <Text style={styles.bulletPoint}>• Enforce our agreements</Text>
          <Text style={styles.paragraph}>
            When you close your account, we will delete or anonymize your personal data within 90 days, unless we are required by law to retain it longer.
          </Text>

          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our Service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </Text>

          <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from your country. We ensure appropriate safeguards are in place for such transfers.
          </Text>

          <Text style={styles.sectionTitle}>9. Camera and Photo Permissions</Text>
          <Text style={styles.paragraph}>
            FieldCheck requires camera access to:
          </Text>
          <Text style={styles.bulletPoint}>• Scan QR codes and barcodes</Text>
          <Text style={styles.bulletPoint}>• Capture photos for AI analysis</Text>
          <Text style={styles.bulletPoint}>• Document assets and inspections</Text>
          <Text style={styles.paragraph}>
            Photos are only uploaded when you explicitly choose to analyze them with AI or save them to an asset record. You can revoke camera permissions at any time through your device settings.
          </Text>

          <Text style={styles.sectionTitle}>10. AI and Machine Learning</Text>
          <Text style={styles.paragraph}>
            Our AI analysis features process images you upload to detect defects and anomalies. Images used for AI analysis:
          </Text>
          <Text style={styles.bulletPoint}>• Are processed securely on our servers</Text>
          <Text style={styles.bulletPoint}>• May be used to improve our AI models (with your consent)</Text>
          <Text style={styles.bulletPoint}>• Can be deleted from our servers at your request</Text>
          <Text style={styles.bulletPoint}>• Are never shared with third parties for marketing purposes</Text>

          <Text style={styles.sectionTitle}>11. Cookies and Tracking</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your device to refuse all cookies or to indicate when a cookie is being sent.
          </Text>

          <Text style={styles.sectionTitle}>12. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            We use the following third-party services:
          </Text>
          <Text style={styles.bulletPoint}>• Stripe: Payment processing (Privacy Policy: stripe.com/privacy)</Text>
          <Text style={styles.bulletPoint}>• Google Cloud: Cloud infrastructure and AI services</Text>
          <Text style={styles.bulletPoint}>• Analytics: App performance and usage analytics</Text>

          <Text style={styles.sectionTitle}>13. California Privacy Rights</Text>
          <Text style={styles.paragraph}>
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
          </Text>
          <Text style={styles.bulletPoint}>• Right to know what personal information is collected</Text>
          <Text style={styles.bulletPoint}>• Right to know if personal information is sold or disclosed</Text>
          <Text style={styles.bulletPoint}>• Right to say no to the sale of personal information</Text>
          <Text style={styles.bulletPoint}>• Right to access your personal information</Text>
          <Text style={styles.bulletPoint}>• Right to equal service and price</Text>

          <Text style={styles.sectionTitle}>14. GDPR Compliance</Text>
          <Text style={styles.paragraph}>
            For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). Our legal basis for processing your data includes:
          </Text>
          <Text style={styles.bulletPoint}>• Contract: Processing necessary to provide our services</Text>
          <Text style={styles.bulletPoint}>• Consent: When you give us explicit consent</Text>
          <Text style={styles.bulletPoint}>• Legitimate interests: For improving our service</Text>
          <Text style={styles.bulletPoint}>• Legal obligation: When required by law</Text>

          <Text style={styles.sectionTitle}>15. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by:
          </Text>
          <Text style={styles.bulletPoint}>• Posting the new Privacy Policy in the app</Text>
          <Text style={styles.bulletPoint}>• Sending you an email notification</Text>
          <Text style={styles.bulletPoint}>• Displaying a prominent notice in the app</Text>
          <Text style={styles.paragraph}>
            You are advised to review this Privacy Policy periodically for any changes.
          </Text>

          <Text style={styles.sectionTitle}>16. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@fieldcheck.app</Text>
          <Text style={styles.contactInfo}>Data Protection Officer: dpo@fieldcheck.app</Text>
          <Text style={styles.contactInfo}>Phone: +1 (555) 123-4567</Text>
          <Text style={styles.contactInfo}>Address: 123 Tech Street, San Francisco, CA 94105</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using FieldCheck Mobile, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and use of your information as described herein.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  introduction: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 20,
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 22,
    marginLeft: 10,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 5,
  },
  footer: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default PrivacyPolicy;
