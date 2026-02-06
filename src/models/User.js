// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Subscription fields
  subscription: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'canceled', 'past_due', 'trialing'],
      default: 'inactive'
    },
    planType: {
      type: String,
      enum: ['basic', 'pro', 'enterprise', null],
      default: null
    },
    billingInterval: {
      type: String,
      enum: ['monthly', 'yearly', null],
      default: null
    },
    stripeCustomerId: {
      type: String,
      default: null
    },
    stripeSubscriptionId: {
      type: String,
      default: null
    },
    currentPeriodStart: {
      type: Date,
      default: null
    },
    currentPeriodEnd: {
      type: Date,
      default: null
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    trialEndsAt: {
      type: Date,
      default: null
    }
  },

  // Usage tracking (for plan limits)
  usage: {
    inspectionsThisMonth: {
      type: Number,
      default: 0
    },
    storageUsedGB: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },

  // Profile fields
  company: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },

  // Account status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for checking if subscription is active
userSchema.virtual('hasActiveSubscription').get(function() {
  return this.subscription.status === 'active' || this.subscription.status === 'trialing';
});

// Method to check if user can perform action based on plan limits
userSchema.methods.canPerformAction = function(action) {
  const { subscriptionPlans } = require('../config/subscription.config');
  
  if (!this.hasActiveSubscription) {
    return false;
  }

  const plan = subscriptionPlans[this.subscription.planType];
  
  if (!plan) {
    return false;
  }

  switch (action) {
    case 'createInspection':
      // Check inspection limit
      if (plan.limits.inspectionsPerMonth === -1) {
        return true; // Unlimited
      }
      return this.usage.inspectionsThisMonth < plan.limits.inspectionsPerMonth;
    
    case 'uploadPhoto':
      // Check storage limit
      if (plan.limits.storageGB === -1) {
        return true; // Unlimited
      }
      return this.usage.storageUsedGB < plan.limits.storageGB;
    
    case 'addTeamMember':
      // Check team member limit
      if (plan.limits.teamMembers === -1) {
        return true; // Unlimited
      }
      // You would need to count team members here
      return true; // Placeholder
    
    default:
      return true;
  }
};

// Method to increment usage
userSchema.methods.incrementUsage = async function(type, amount = 1) {
  switch (type) {
    case 'inspection':
      this.usage.inspectionsThisMonth += amount;
      break;
    case 'storage':
      this.usage.storageUsedGB += amount;
      break;
  }
  await this.save();
};

// Method to reset monthly usage (call this via cron job)
userSchema.methods.resetMonthlyUsage = async function() {
  this.usage.inspectionsThisMonth = 0;
  this.usage.lastResetDate = Date.now();
  await this.save();
};

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);