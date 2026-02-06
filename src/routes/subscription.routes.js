// routes/subscription.routes.js
const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe.service');
const { subscriptionPlans } = require('../config/subscription.config');
const { protect } = require('../middleware/auth'); // Your auth middleware

/**
 * GET /api/subscriptions/plans
 * Get all available subscription plans
 */
router.get('/plans', (req, res) => {
  try {
    // Remove sensitive price IDs before sending to client
    const publicPlans = Object.entries(subscriptionPlans).reduce((acc, [key, plan]) => {
      acc[key] = {
        name: plan.name,
        popular: plan.popular,
        features: plan.features,
        limits: plan.limits,
        pricing: {
          monthly: {
            amount: plan.pricing.monthly.amount,
            currency: plan.pricing.monthly.currency,
            interval: plan.pricing.monthly.interval
          },
          yearly: {
            amount: plan.pricing.yearly.amount,
            currency: plan.pricing.yearly.currency,
            interval: plan.pricing.yearly.interval,
            savings: plan.pricing.yearly.savings
          }
        }
      };
      return acc;
    }, {});

    res.json({
      success: true,
      plans: publicPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plans',
      error: error.message
    });
  }
});

/**
 * POST /api/subscriptions/checkout
 * Create a checkout session
 */
router.post('/checkout', protect, async (req, res) => {
  try {
    const { planType, billingInterval } = req.body;
    const userId = req.user.id; // From auth middleware
    const email = req.user.email;

    if (!planType || !billingInterval) {
      return res.status(400).json({
        success: false,
        message: 'planType and billingInterval are required'
      });
    }

    // Define success and cancel URLs
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/subscription/success`;
    const cancelUrl = `${baseUrl}/subscription/cancel`;

    const session = await stripeService.createCheckoutSession(
      userId,
      email,
      planType,
      billingInterval,
      successUrl,
      cancelUrl
    );

    res.json(session);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
});

/**
 * POST /api/subscriptions/portal
 * Create a billing portal session
 */
router.post('/portal', protect, async (req, res) => {
  try {
    const customerId = req.user.stripeCustomerId; // Stored in user model

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'No Stripe customer ID found'
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/subscription`;

    const session = await stripeService.createBillingPortalSession(
      customerId,
      returnUrl
    );

    res.json(session);
  } catch (error) {
    console.error('Portal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating billing portal session',
      error: error.message
    });
  }
});

/**
 * GET /api/subscriptions/current
 * Get current subscription details
 */
router.get('/current', protect, async (req, res) => {
  try {
    const subscriptionId = req.user.subscriptionId; // Stored in user model

    if (!subscriptionId) {
      return res.json({
        success: true,
        subscription: null,
        message: 'No active subscription'
      });
    }

    const subscription = await stripeService.getSubscription(subscriptionId);

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
});

/**
 * POST /api/subscriptions/cancel
 * Cancel subscription at period end
 */
router.post('/cancel', protect, async (req, res) => {
  try {
    const subscriptionId = req.user.subscriptionId;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    const result = await stripeService.cancelSubscription(subscriptionId);

    res.json(result);
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling subscription',
      error: error.message
    });
  }
});

/**
 * POST /api/subscriptions/reactivate
 * Reactivate a canceled subscription
 */
router.post('/reactivate', protect, async (req, res) => {
  try {
    const subscriptionId = req.user.subscriptionId;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No subscription found'
      });
    }

    const result = await stripeService.reactivateSubscription(subscriptionId);

    res.json(result);
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reactivating subscription',
      error: error.message
    });
  }
});

/**
 * POST /api/subscriptions/update
 * Update subscription plan or billing interval
 */
router.post('/update', protect, async (req, res) => {
  try {
    const { planType, billingInterval } = req.body;
    const subscriptionId = req.user.subscriptionId;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    if (!planType || !billingInterval) {
      return res.status(400).json({
        success: false,
        message: 'planType and billingInterval are required'
      });
    }

    const result = await stripeService.updateSubscription(
      subscriptionId,
      planType,
      billingInterval
    );

    res.json(result);
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription',
      error: error.message
    });
  }
});

/**
 * POST /api/subscriptions/webhook
 * Handle Stripe webhooks
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    // Verify webhook signature
    const event = stripeService.verifyWebhookSignature(req.body, signature);

    // Handle the event
    const result = await stripeService.handleWebhook(event);

    // Update database based on event type
    // TODO: Implement database updates based on result
    
    console.log('Webhook processed:', result);

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook error',
      error: error.message
    });
  }
});

module.exports = router;
