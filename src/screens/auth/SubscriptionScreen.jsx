import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SubscriptionScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9',
      period: '/month',
      features: [
        'Up to 50 assets',
        'Basic inspections',
        'Standard reports',
        'Email support',
        'Mobile app access',
        '5GB storage',
      ],
      color: ['#64748b', '#475569'],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited assets',
        'AI-powered analysis',
        'Advanced reports',
        'Priority support',
        'Custom branding',
        '50GB storage',
        'Team collaboration',
        'API access',
      ],
      color: ['#3b82f6', '#2563eb'],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        '24/7 phone support',
        'On-premise deployment',
        'Unlimited storage',
        'SLA guarantee',
        'Training & onboarding',
      ],
      color: ['#8b5cf6', '#7c3aed'],
      popular: false,
    },
  ];

  const handleSubscribe = async (planId) => {
    if (planId === 'enterprise') {
      // For enterprise, contact sales
      Alert.alert(
        'Enterprise Plan',
        'Contact our sales team for custom pricing and features.',
        [
          {
            text: 'Email Sales',
            onPress: () => Linking.openURL('mailto:3dpeektech@consultant.com?subject=Enterprise Plan Inquiry'),
          },
          {
            text: 'Call Sales',
            onPress: () => Linking.openURL('tel:+31630165666'),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    // For Basic and Pro plans - Stripe integration
    Alert.alert(
      'Subscribe',
      `You selected the ${plans.find(p => p.id === planId)?.name} plan.\n\nYou will be redirected to Stripe for secure payment.`,
      [
        {
          text: 'Continue to Payment',
          onPress: () => {
            // In production, this would open Stripe checkout
            const stripeUrl = `https://buy.stripe.com/test_your_product_id?prefilled_email=user@example.com&client_reference_id=${planId}`;
            
            Alert.alert(
              'Stripe Integration',
              'In production mode, this will open Stripe checkout.\n\nFor demo purposes, we\'ll simulate the flow.',
              [
                {
                  text: 'Demo Payment',
                  onPress: () => {
                    Alert.alert(
                      'Success!',
                      `You've subscribed to the ${plans.find(p => p.id === planId)?.name} plan!\n\n(This is a demo - no actual charge)`,
                      [
                        {
                          text: 'OK',
                          onPress: () => navigation.goBack(),
                        },
                      ]
                    );
                  },
                },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
            
            // Uncomment for production:
            // Linking.openURL(stripeUrl);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
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
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <Text style={styles.headerSubtitle}>Unlock all features with a subscription</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan Banner */}
        <View style={styles.currentPlanBanner}>
          <View style={styles.bannerIcon}>
            <Text style={styles.bannerEmoji}>✨</Text>
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Free Trial Active</Text>
            <Text style={styles.bannerSubtitle}>3 days remaining</Text>
          </View>
        </View>

        {/* Plans */}
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planContainer}>
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            <LinearGradient
              colors={plan.color}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
              ]}
            >
              <TouchableOpacity
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.9}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{plan.price}</Text>
                    <Text style={styles.period}>{plan.period}</Text>
                  </View>
                </View>

                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={styles.checkIcon}>✓</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    selectedPlan === plan.id && styles.selectedButton,
                  ]}
                  onPress={() => handleSubscribe(plan.id)}
                >
                  <Text style={styles.subscribeButtonText}>
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Subscribe Now'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))}

        {/* Features Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>All plans include:</Text>
          <View style={styles.comparisonList}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>🔒</Text>
              <Text style={styles.comparisonText}>Bank-level security</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>📱</Text>
              <Text style={styles.comparisonText}>iOS & Android apps</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>☁️</Text>
              <Text style={styles.comparisonText}>Cloud backup</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>🔄</Text>
              <Text style={styles.comparisonText}>Regular updates</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>📊</Text>
              <Text style={styles.comparisonText}>Export to PDF/Excel</Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>Secure Payment</Text>
          <Text style={styles.paymentText}>
            All payments are processed securely through Stripe. We never store your credit card information.
          </Text>
          <View style={styles.paymentLogos}>
            <View style={styles.paymentLogo}>
              <Text>💳</Text>
            </View>
            <View style={styles.paymentLogo}>
              <Text>🔒</Text>
            </View>
            <View style={styles.paymentLogo}>
              <Text>✓</Text>
            </View>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes! Cancel anytime from your account settings. No questions asked.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Do you offer refunds?</Text>
            <Text style={styles.faqAnswer}>
              Yes, we offer a 30-day money-back guarantee if you're not satisfied.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I change plans later?</Text>
            <Text style={styles.faqAnswer}>
              Absolutely! Upgrade or downgrade your plan anytime. Changes take effect immediately.
            </Text>
          </View>
        </View>

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
  currentPlanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerEmoji: {
    fontSize: 24,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  planContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350f',
  },
  planCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedPlan: {
    transform: [{ scale: 1.02 }],
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
  },
  period: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    fontSize: 16,
    color: '#ffffff',
    marginRight: 12,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.95,
  },
  subscribeButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#fbbf24',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  comparisonSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  comparisonList: {},
  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  comparisonText: {
    fontSize: 14,
    color: '#64748b',
  },
  paymentInfo: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  paymentLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  paymentLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default SubscriptionScreen;
