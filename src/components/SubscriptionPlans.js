// components/SubscriptionPlans.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';

const SubscriptionPlans = ({ navigation }) => {
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('YOUR_API_URL/api/subscriptions/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      Alert.alert('Error', 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planType) => {
    setProcessingCheckout(true);
    try {
      // Get auth token from your auth context/storage
      const token = await getAuthToken(); // Implement this based on your auth setup
      
      const response = await axios.post(
        'YOUR_API_URL/api/subscriptions/checkout',
        {
          planType,
          billingInterval
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Open Stripe checkout URL in browser
        // You can use Linking or WebView
        const { url } = response.data;
        // Linking.openURL(url);
        
        // Or navigate to a WebView screen
        navigation.navigate('CheckoutWebView', { url });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Failed to start checkout process');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const formatPrice = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Get started with FieldCheck and transform your field inspections
        </Text>
      </View>

      {/* Billing Interval Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            billingInterval === 'monthly' && styles.toggleButtonActive
          ]}
          onPress={() => setBillingInterval('monthly')}
        >
          <Text
            style={[
              styles.toggleText,
              billingInterval === 'monthly' && styles.toggleTextActive
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            billingInterval === 'yearly' && styles.toggleButtonActive
          ]}
          onPress={() => setBillingInterval('yearly')}
        >
          <Text
            style={[
              styles.toggleText,
              billingInterval === 'yearly' && styles.toggleTextActive
            ]}
          >
            Yearly
          </Text>
          {plans?.basic?.pricing?.yearly?.savings && (
            <Text style={styles.savingsBadge}>
              Save {plans.basic.pricing.yearly.savings}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <View style={styles.plansContainer}>
        {plans && Object.entries(plans).map(([planKey, plan]) => (
          <View
            key={planKey}
            style={[
              styles.planCard,
              plan.popular && styles.popularPlanCard
            ]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {formatPrice(plan.pricing[billingInterval].amount)}
              </Text>
              <Text style={styles.priceInterval}>
                /{billingInterval === 'monthly' ? 'month' : 'year'}
              </Text>
            </View>

            {billingInterval === 'yearly' && (
              <Text style={styles.savingsText}>
                Save {plan.pricing.yearly.savings} compared to monthly
              </Text>
            )}

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                plan.popular && styles.popularSubscribeButton,
                processingCheckout && styles.disabledButton
              ]}
              onPress={() => handleSubscribe(planKey)}
              disabled={processingCheckout}
            >
              {processingCheckout && selectedPlan === planKey ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  Get Started
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All plans include a 14-day free trial. Cancel anytime.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#2196F3',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  savingsBadge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 2,
  },
  plansContainer: {
    padding: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  popularPlanCard: {
    borderColor: '#2196F3',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  priceInterval: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  savingsText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 12,
  },
  featuresContainer: {
    marginVertical: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#4CAF50',
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#666',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  popularSubscribeButton: {
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default SubscriptionPlans;
