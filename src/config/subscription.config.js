// config/subscription.config.js
// Subscription Plans Configuration

const subscriptionPlans = {
  basic: {
    name: 'Basic',
    features: [
      'Up to 10 field inspections per month',
      'Basic AI analysis',
      'Photo documentation',
      'Email support',
      'Mobile app access'
    ],
    limits: {
      inspectionsPerMonth: 10,
      storageGB: 5,
      teamMembers: 1
    },
    pricing: {
      monthly: {
        amount: 9.99,
        currency: 'USD',
        priceId: process.env.BASIC_PLAN_MONTHLY_PRICE_ID,
        interval: 'month'
      },
      yearly: {
        amount: 99.99,
        currency: 'USD',
        priceId: process.env.BASIC_PLAN_YEARLY_PRICE_ID,
        interval: 'year',
        savings: '17%' // (9.99 * 12 - 99.99) / (9.99 * 12) * 100
      }
    }
  },
  pro: {
    name: 'Pro',
    popular: true, // Mark as most popular
    features: [
      'Unlimited field inspections',
      'Advanced AI analysis with recommendations',
      'Unlimited photo storage',
      'Priority support',
      'Team collaboration (up to 5 members)',
      'Export reports (PDF, CSV)',
      'Custom templates'
    ],
    limits: {
      inspectionsPerMonth: -1, // unlimited
      storageGB: 50,
      teamMembers: 5
    },
    pricing: {
      monthly: {
        amount: 29.99,
        currency: 'USD',
        priceId: process.env.PRO_PLAN_MONTHLY_PRICE_ID,
        interval: 'month'
      },
      yearly: {
        amount: 299.99,
        currency: 'USD',
        priceId: process.env.PRO_PLAN_YEARLY_PRICE_ID,
        interval: 'year',
        savings: '17%'
      }
    }
  },
  enterprise: {
    name: 'Enterprise',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Unlimited storage',
      'Custom AI model training',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment option',
      'Advanced analytics dashboard'
    ],
    limits: {
      inspectionsPerMonth: -1,
      storageGB: -1, // unlimited
      teamMembers: -1 // unlimited
    },
    pricing: {
      monthly: {
        amount: 99.99,
        currency: 'USD',
        priceId: process.env.ENTERPRISE_PLAN_MONTHLY_PRICE_ID,
        interval: 'month'
      },
      yearly: {
        amount: 999.99,
        currency: 'USD',
        priceId: process.env.ENTERPRISE_PLAN_YEARLY_PRICE_ID,
        interval: 'year',
        savings: '17%'
      }
    }
  }
};

// Helper function to get plan by price ID
const getPlanByPriceId = (priceId) => {
  for (const [planKey, planData] of Object.entries(subscriptionPlans)) {
    if (planData.pricing.monthly.priceId === priceId) {
      return { plan: planKey, interval: 'monthly', ...planData };
    }
    if (planData.pricing.yearly.priceId === priceId) {
      return { plan: planKey, interval: 'yearly', ...planData };
    }
  }
  return null;
};

// Helper function to calculate savings
const calculateSavings = (monthlyPrice, yearlyPrice) => {
  const annualMonthly = monthlyPrice * 12;
  const savings = ((annualMonthly - yearlyPrice) / annualMonthly * 100).toFixed(0);
  return `${savings}%`;
};

module.exports = {
  subscriptionPlans,
  getPlanByPriceId,
  calculateSavings
};
