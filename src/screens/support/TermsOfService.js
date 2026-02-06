import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const TermsOfService = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.lastUpdated}>Last Updated: February 4, 2026</Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using FieldCheck Mobile ("the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Text>

          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily download one copy of FieldCheck Mobile for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Text>
          <Text style={styles.bulletPoint}>• Modify or copy the materials</Text>
          <Text style={styles.bulletPoint}>• Use the materials for any commercial purpose</Text>
          <Text style={styles.bulletPoint}>• Attempt to decompile or reverse engineer any software contained in FieldCheck</Text>
          <Text style={styles.bulletPoint}>• Remove any copyright or other proprietary notations from the materials</Text>
          <Text style={styles.bulletPoint}>• Transfer the materials to another person or "mirror" the materials on any other server</Text>

          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </Text>
          <Text style={styles.paragraph}>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </Text>

          <Text style={styles.sectionTitle}>4. Subscriptions</Text>
          <Text style={styles.paragraph}>
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (monthly or annually). Billing cycles are set at the start of your subscription.
          </Text>
          <Text style={styles.paragraph}>
            At the end of each billing cycle, your subscription will automatically renew unless you cancel it or FieldCheck cancels it. You may cancel your subscription renewal through your account settings.
          </Text>

          <Text style={styles.sectionTitle}>5. Free Trial</Text>
          <Text style={styles.paragraph}>
            FieldCheck may offer a free trial. At any time and without notice, FieldCheck reserves the right to modify the terms of the free trial offer or cancel such free trial offer.
          </Text>

          <Text style={styles.sectionTitle}>6. Fee Changes</Text>
          <Text style={styles.paragraph}>
            FieldCheck, in its sole discretion and at any time, may modify the subscription fees. Any subscription fee change will become effective at the end of the then-current billing cycle. We will provide you with reasonable prior notice of any change in subscription fees.
          </Text>

          <Text style={styles.sectionTitle}>7. Refunds</Text>
          <Text style={styles.paragraph}>
            We offer a 30-day money-back guarantee for all subscription plans. If you are not satisfied with the service within the first 30 days, you may request a full refund by contacting support@fieldcheck.app.
          </Text>

          <Text style={styles.sectionTitle}>8. Content</Text>
          <Text style={styles.paragraph}>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the Service.
          </Text>
          <Text style={styles.paragraph}>
            By posting content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.
          </Text>

          <Text style={styles.sectionTitle}>9. Prohibited Uses</Text>
          <Text style={styles.paragraph}>
            You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </Text>
          <Text style={styles.bulletPoint}>• In any way that violates any applicable law or regulation</Text>
          <Text style={styles.bulletPoint}>• To transmit any advertising or promotional material</Text>
          <Text style={styles.bulletPoint}>• To impersonate or attempt to impersonate FieldCheck, a FieldCheck employee, another user</Text>
          <Text style={styles.bulletPoint}>• To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</Text>

          <Text style={styles.sectionTitle}>10. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of FieldCheck and its licensors. The Service is protected by copyright, trademark, and other laws.
          </Text>

          <Text style={styles.sectionTitle}>11. AI Analysis Disclaimer</Text>
          <Text style={styles.paragraph}>
            FieldCheck's AI analysis features are provided for informational purposes only and should not replace professional inspection or engineering judgment. While we strive for accuracy, AI predictions may not always be 100% accurate. Users should verify critical findings with qualified professionals.
          </Text>

          <Text style={styles.sectionTitle}>12. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            In no event shall FieldCheck, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </Text>

          <Text style={styles.sectionTitle}>13. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </Text>

          <Text style={styles.sectionTitle}>14. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which FieldCheck operates, without regard to its conflict of law provisions.
          </Text>

          <Text style={styles.sectionTitle}>15. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </Text>

          <Text style={styles.sectionTitle}>16. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@fieldcheck.app</Text>
          <Text style={styles.contactInfo}>Phone: +1 (555) 123-4567</Text>
          <Text style={styles.contactInfo}>Address: 123 Tech Street, San Francisco, CA 94105</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using FieldCheck Mobile, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
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

export default TermsOfService;
