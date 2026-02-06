// services/stripe.service.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { subscriptionPlans, getPlanByPriceId } = require('../config/subscription.config');

class StripeService {
  /**
   * Create a checkout session for subscription
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} planType - 'basic', 'pro', or 'enterprise'
   * @param {string} billingInterval - 'monthly' or 'yearly'
   * @param {string} successUrl - Success redirect URL
   * @param {string} cancelUrl - Cancel redirect URL
   */
  async createCheckoutSession(userId, email, planType, billingInterval = 'monthly', successUrl, cancelUrl) {
    try {
      const plan = subscriptionPlans[planType];
      
      if (!plan) {
        throw new Error('Invalid plan type');
      }

      if (!['monthly', 'yearly'].includes(billingInterval)) {
        throw new Error('Invalid billing interval. Must be "monthly" or "yearly"');
      }

      const priceId = plan.pricing[billingInterval].priceId;

      if (!priceId) {
        throw new Error(`Price ID not configured for ${planType} ${billingInterval}`);
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          planType,
          billingInterval
        },
        subscription_data: {
          metadata: {
            userId,
            planType,
            billingInterval
          },
        },
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        allow_promotion_codes: true, // Allow promo codes
      });

      return {
        success: true,
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Create a billing portal session for managing subscriptions
   */
  async createBillingPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return {
        success: true,
        url: session.url
      };
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw error;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      const priceId = subscription.items.data[0].price.id;
      const planInfo = getPlanByPriceId(priceId);

      return {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        currentPeriodStart: subscription.current_period_start,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        planType: planInfo?.plan || 'unknown',
        billingInterval: planInfo?.interval || 'unknown',
        amount: subscription.items.data[0].price.unit_amount / 100,
        currency: subscription.items.data[0].price.currency,
      };
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      return {
        success: true,
        cancelAt: subscription.cancel_at,
        currentPeriodEnd: subscription.current_period_end
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      return {
        success: true,
        subscription
      };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  /**
   * Update subscription plan or billing interval
   */
  async updateSubscription(subscriptionId, newPlanType, newBillingInterval) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const newPlan = subscriptionPlans[newPlanType];
      
      if (!newPlan) {
        throw new Error('Invalid plan type');
      }

      const newPriceId = newPlan.pricing[newBillingInterval].priceId;

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations', // Prorate the change
        metadata: {
          planType: newPlanType,
          billingInterval: newBillingInterval
        }
      });

      return {
        success: true,
        subscription: updatedSubscription
      };
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          // Update user subscription in database
          return {
            type: 'checkout.completed',
            userId: session.metadata.userId,
            planType: session.metadata.planType,
            billingInterval: session.metadata.billingInterval,
            subscriptionId: session.subscription,
            customerId: session.customer
          };
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object;
          const priceId = subscription.items.data[0].price.id;
          const planInfo = getPlanByPriceId(priceId);
          
          return {
            type: 'subscription.updated',
            subscriptionId: subscription.id,
            status: subscription.status,
            planType: planInfo?.plan,
            billingInterval: planInfo?.interval,
            userId: subscription.metadata.userId
          };
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          return {
            type: 'subscription.deleted',
            subscriptionId: subscription.id,
            userId: subscription.metadata.userId
          };
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object;
          return {
            type: 'payment.succeeded',
            subscriptionId: invoice.subscription,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency
          };
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object;
          return {
            type: 'payment.failed',
            subscriptionId: invoice.subscription,
            customerId: invoice.customer
          };
        }

        default:
          return { type: 'unhandled', eventType: event.type };
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();
