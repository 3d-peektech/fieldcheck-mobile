export const STRIPE_CONFIG = {
  publishableKey: 'pk_live_xxxxx', // Your Stripe publishable key
  
  plans: {
    basic: {
      monthly: {
        priceId: 'price_1Sx9rqGLbG2yglsw9ts3oDDf', // Get from Stripe dashboard
        amount: 99,
        currency: 'usd'
      },
      yearly: {
        priceId: 'price_1Sx9yhGLbG2yglswJixIxihQ',
        amount: 990,
        currency: 'eur'
      }
    },
    pro: {
      monthly: {
        priceId: 'price_1Sx9uSGLbG2yglswkkKnXix1', // Your Pro monthly price ID
        amount: 299,
        currency: 'usd'
      },
      yearly: {
        priceId: 'price_1Sx9zwGLbG2yglswJWXKqd0g',
        amount: 2990,
        currency: 'eur'
      }
    },
    enterprise: {
      monthly: {
        priceId: 'price_1Sx9w4GLbG2yglswbX85RTu3', // Your Enterprise monthly price ID
        amount: 300,
        currency: 'usd'
      },
      yearly: {
        priceId: 'price_1SxA15GLbG2yglswKJvTmmXY',
        amount: 4000,
        currency: 'eur'
      }
    }
  }
};