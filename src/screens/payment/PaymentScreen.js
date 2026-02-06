import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.fieldcheck.app';

const PaymentScreen = ({ route, navigation }) => {
  const { plan } = route.params || {};  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plan || 'pro');

  const plans: {
    basic: {
      name: 'Basic',
      monthly: {
        priceId: "price_1Sx9rqGLbG2yglsw9ts3oDDf",
        amount: 99,
        currency: 'usd'
      },
      yearly: {
        priceId: "price_1Sx9yhGLbG2yglswJixIxihQ",
        amount: 990,
        currency: 'eur'
      },
      features: [
        'Up to 50 assets',
        'Basic inspections',
        'QR code scanning',
        'Mobile access',
        'Email support',
      ]
    },
    pro: {
      name: 'Professional',
      monthly: {
        priceId: "price_1Sx9uSGLbG2yglswkkKnXix1",
        amount: 299,
        currency: 'usd'
      },
      yearly: {
        priceId: "price_1Sx9zwGLbG2yglswJWXKqd0g",
        amount: 2990,
        currency: 'eur'
      },
      features: [
        'Everything in Basic',
        'Unlimited assets',
        'AI-powered analysis',
        'Financial predictions',
        'Priority support',
        'Team collaboration',
        'API access',
      ]
    },
    enterprise: {
      name: 'Enterprise',
      monthly: {
        priceId: "price_1Sx9w4GLbG2yglswbX85RTu3",
        amount: 300,
        currency: 'usd'
      },
      yearly: {
        priceId: "price_1SxA15GLbG2yglswKJvTmmXY",
        amount: 4000,
        currency: 'eur'
      },
      features: [
        'Everything in Pro',
        'Unlimited users',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'On-premise option',
        'Advanced security',
      ]
    }
  }
};

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const planDetails = plans[selectedPlan];

      // Create Stripe Checkout Session
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/create-checkout`,
        {
          priceId: planDetails.priceId,
          planName: planDetails.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { checkoutUrl, sessionId } = response.data;

      // In production, open Stripe Checkout
      // For mobile, you'd use Stripe React Native SDK
      Alert.alert(
        'Subscribe',
        `You are subscribing to ${planDetails.name} plan for $${planDetails.price}/${planDetails.period}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: async () => {
              // TODO: Open Stripe Checkout in WebView or use Stripe SDK
              // For now, show success message
              Alert.alert(
                'Success!',
                'Your subscription has been activated. Welcome to FieldCheck Pro!',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Profile')
                  }
                ]
              );
            }
          }
        ]
      );

      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <Text style={styles.headerSubtitle}>
          Upgrade to unlock premium features
        </Text>
      </View>

      {/* Plan Cards */}
      {Object.entries(plans).map(([key, planData]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.planCard,
            selectedPlan === key && styles.planCardSelected,
            planData.popular && styles.planCardPopular,
          ]}
          onPress={() => setSelectedPlan(key)}
        >
          {planData.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>MOST POPULAR</Text>
            </View>
          )}

          <View style={styles.planHeader}>
            <View style={styles.radioButton}>
              {selectedPlan === key && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{planData.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.planPrice}>${planData.price}</Text>
                <Text style={styles.planPeriod}>/{planData.period}</Text>
              </View>
            </View>
          </View>

          <View style={styles.featuresList}>
            {planData.features.map((feature, index) => (
              <Text key={index} style={styles.feature}>
                {feature}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}

      {/* Payment Info */}
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentInfoTitle}>💳 Secure Payment</Text>
        <Text style={styles.paymentInfoText}>
          All transactions are secured by Stripe. Your payment information is encrypted and never stored on our servers.
        </Text>
      </View>

      {/* Guarantee */}
      <View style={styles.guaranteeCard}>
        <Text style={styles.guaranteeIcon}>✓</Text>
        <View style={styles.guaranteeContent}>
          <Text style={styles.guaranteeTitle}>30-Day Money-Back Guarantee</Text>
          <Text style={styles.guaranteeText}>
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </Text>
        </View>
      </View>

      {/* Subscribe Button */}
      <TouchableOpacity
        style={[styles.subscribeButton, loading && styles.subscribeButtonDisabled]}
        onPress={handleSubscribe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.subscribeButtonText}>
              Subscribe to {plans[selectedPlan].name}
            </Text>
            <Text style={styles.subscribeButtonPrice}>
              ${plans[selectedPlan].price}/{plans[selectedPlan].period}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Terms */}
      <View style={styles.terms}>
        <Text style={styles.termsText}>
          By subscribing, you agree to our{' '}
          <Text 
            style={styles.termsLink}
            onPress={() => navigation.navigate('TermsOfService')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text 
            style={styles.termsLink}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  planCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  planCardSelected: {
    borderColor: '#3498db',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  planCardPopular: {
    borderColor: '#f39c12',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#f39c12',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  planPeriod: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  featuresList: {
    marginTop: 10,
  },
  feature: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 10,
    lineHeight: 22,
  },
  paymentInfo: {
    backgroundColor: '#e3f2fd',
    margin: 15,
    padding: 20,
    borderRadius: 10,
  },
  paymentInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 10,
  },
  paymentInfoText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
  guaranteeCard: {
    flexDirection: 'row',
    backgroundColor: '#d4edda',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  guaranteeIcon: {
    fontSize: 32,
    color: '#28a745',
    marginRight: 15,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 5,
  },
  guaranteeText: {
    fontSize: 14,
    color: '#155724',
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#27ae60',
    margin: 15,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subscribeButtonPrice: {
    color: '#fff',
    fontSize: 14,
  },
  terms: {
    padding: 15,
  },
  termsText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default PaymentScreen;
