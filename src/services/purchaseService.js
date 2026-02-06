// src/services/purchaseService.js
import RNIap, {
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  acknowledgePurchaseAndroid
} from 'react-native-iap';
import { Platform } from 'react-native';
import api from './api';

const PRODUCT_IDS = Platform.select({
  ios: [
    'com.fieldcheck.basic.monthly',
    'com.fieldcheck.basic.yearly',
    'com.fieldcheck.pro.monthly',
    'com.fieldcheck.pro.yearly',
    'com.fieldcheck.enterprise.monthly',
    'com.fieldcheck.enterprise.yearly'
  ],
  android: [
    'fieldcheck_basic_monthly',
    'fieldcheck_basic_yearly',
    'fieldcheck_pro_monthly',
    'fieldcheck_pro_yearly',
    'fieldcheck_enterprise_monthly',
    'fieldcheck_enterprise_yearly'
  ]
});

class PurchaseService {
  purchaseUpdateSubscription = null;
  purchaseErrorSubscription = null;

  async initialize() {
    try {
      await RNIap.initConnection();
      console.log('IAP Connection initialized');
      
      // Set up listeners
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase) => {
          console.log('Purchase updated:', purchase);
          const receipt = purchase.transactionReceipt;
          
          if (receipt) {
            try {
              // Verify purchase with your backend
              await this.verifyPurchase(purchase);
              
              // Acknowledge the purchase (Android)
              if (Platform.OS === 'android') {
                await acknowledgePurchaseAndroid(purchase.purchaseToken);
              }
              
              // Finish the transaction
              await finishTransaction({ purchase });
              
              console.log('Purchase successful and verified');
            } catch (error) {
              console.error('Purchase verification failed:', error);
            }
          }
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener(
        (error) => {
          console.warn('Purchase error:', error);
        }
      );
    } catch (error) {
      console.error('IAP initialization failed:', error);
    }
  }

  async getProducts() {
    try {
      const products = await RNIap.getSubscriptions(PRODUCT_IDS);
      console.log('Available products:', products);
      return products;
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  async purchaseSubscription(productId) {
    try {
      await RNIap.requestSubscription(productId);
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async verifyPurchase(purchase) {
    try {
      const response = await api.post('/subscriptions/verify', {
        platform: Platform.OS,
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        receipt: purchase.transactionReceipt,
        purchaseToken: purchase.purchaseToken // Android only
      });
      return response.data;
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    }
  }

  async restorePurchases() {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log('Restored purchases:', purchases);
      
      // Verify each purchase with backend
      for (const purchase of purchases) {
        await this.verifyPurchase(purchase);
      }
      
      return purchases;
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  destroy() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
    RNIap.endConnection();
  }
}

export default new PurchaseService();
