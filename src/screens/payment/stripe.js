// src/config/stripe.js
// Stripe Configuration - Production Ready

import {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_PRICE_BASIC_MONTHLY,
  STRIPE_PRICE_PRO_MONTHLY,
  STRIPE_PRICE_ENTERPRISE_MONTHLY,
  STRIPE_PRICE_BASIC_YEARLY,
  STRIPE_PRICE_PRO_YEARLY,
  STRIPE_PRICE_ENTERPRISE_YEARLY,
} from '@env';

export const STRIPE_CONFIG = {
  publishableKey: pk_live_51Mr6ZGGLbG2yglswf3gi7O2LtqgjPuWaricyAIBByjtRKbr0rqDVv7rnNVwew9azC6HNyVmDganAERIXJHs90U6H00uzpv5gBx,
  
  plans: {
    basic: {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small teams and individual professionals',
      monthly: {
        priceId: price_1Sx9rqGLbG2yglsw9ts3oDDf,
        amount: 99,
        currency: 'usd',
        interval: 'month',
      },
      yearly: {
        priceId: price_1Sx9yhGLbG2yglswJixIxihQ,
        amount: 990,
        currency: 'eur',
        interval: 'year',
        savings: '17%', // (99*12 - 990)/990
      },
      features: [
        '✓ Up to 50 assets',
        '✓ Basic inspections',
        '✓ QR code scanning',
        '✓ Mobile access',
        '✓ Email support',
        '✓ Export reports (PDF)',
      ],
      limits: {
        assets: 50,
        users: 1,
        storage: '5GB',
        inspections: 100,
      }
    },
    
    pro: {
      id: 'pro',
      name: 'Professional',
      description: 'For growing teams that need advanced features',
      popular: true, // Show "MOST POPULAR" badge
      monthly: {
        priceId: price_1Sx9uSGLbG2yglswkkKnXix1,
        amount: 299,
        currency: 'usd',
        interval: 'month',
      },
      yearly: {
        priceId: price_1Sx9zwGLbG2yglswJWXKqd0g,
        amount: 2990,
        currency: 'eur',
        interval: 'year',
        savings: '17%',
      },
      features: [
        '✓ Everything in Basic',
        '✓ UNLIMITED assets',
        '✓ AI-powered defect detection',
        '✓ Financial predictions & forecasting',
        '✓ Advanced analytics & insights',
        '✓ Priority support (24h response)',
        '✓ Team collaboration (up to 10 users)',
        '✓ API access',
        '✓ Custom branding',
        '✓ Data export (Excel, CSV)',
      ],
      limits: {
        assets: -1, // Unlimited
        users: 10,
        storage: '50GB',
        inspections: -1, // Unlimited
      }
    },
    
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      monthly: {
        priceId: price_1Sx9w4GLbG2yglswbX85RTu3,
        amount: 300,
        currency: 'usd',
        interval: 'month',
      },
      yearly: {
        priceId: price_1SxA15GLbG2yglswKJvTmmXY,
        amount: 4000,
        currency: 'eur',
        interval: 'year',
        savings: '11%',
      },
      features: [
        '✓ Everything in Pro',
        '✓ UNLIMITED users',
        '✓ Dedicated account manager',
        '✓ Custom integrations',
        '✓ SLA guarantee (99.9% uptime)',
        '✓ On-premise deployment option',
        '✓ Advanced security (SSO, 2FA)',
        '✓ Training & onboarding',
        '✓ White-label option',
        '✓ 24/7 phone support',
        '✓ Custom contracts',
      ],
      limits: {
        assets: -1, // Unlimited
        users: -1, // Unlimited
        storage: 'Unlimited',
        inspections: -1, // Unlimited
      }
    }
  },

  // Trial period (if offering free trial)
  trial: {
    enabled: true,
    days: 30,
    message: '30-day free trial, no credit card required',
  },

  // Money-back guarantee
  guarantee: {
    enabled: true,
    days: 30,
    message: '30-day money-back guarantee',
  },

  // Payment methods accepted
  paymentMethods: ['card', 'sepa_debit', 'ideal'],

  // Currencies supported
  currencies: {
    usd: { symbol: '$', name: 'US Dollar' },
    eur: { symbol: '€', name: 'Euro' },
  },
};

// Helper function to get plan details
export const getPlan = (planId) => {
  return STRIPE_CONFIG.plans[planId] || null;
};

// Helper function to get price ID based on plan and interval
export const getPriceId = (planId, interval = 'monthly') => {
  const plan = getPlan(planId);
  return plan?.[interval]?.priceId || null;
};

// Helper function to format price
export const formatPrice = (amount, currency = 'usd') => {
  const currencyInfo = STRIPE_CONFIG.currencies[currency];
  return `${currencyInfo.symbol}${amount.toLocaleString()}`;
};

export default STRIPE_CONFIG;
