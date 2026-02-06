// REAL-TIME DATA SERVICE
// Servicio centralizado para manejar todas las operaciones de Firebase

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase.config';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

class RealTimeDataService {
  // ============================================
  // DASHBOARD DATA - TIEMPO REAL
  // ============================================

  subscribeToKPIs(callback) {
    const kpisRef = doc(db, 'dashboard', 'kpis');

    return onSnapshot(kpisRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ success: true, data: snapshot.data() });
        } else {
          callback({ success: false, error: 'No KPI data found' });
        }
      },
      (error) => {
        console.error('Error subscribing to KPIs:', error);
        callback({ success: false, error: error.message });
      }
    );
  }

  subscribeToRevenueChart(range = '7d', callback) {
    const chartRef = doc(db, 'dashboard', `revenue_${range}`);

    return onSnapshot(chartRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ success: true, data: snapshot.data() });
        } else {
          callback({ success: false, error: 'No chart data found' });
        }
      },
      (error) => {
        console.error('Error subscribing to revenue chart:', error);
        callback({ success: false, error: error.message });
      }
    );
  }

  subscribeToAssetHealth(callback) {
    const healthRef = doc(db, 'dashboard', 'asset_health');

    return onSnapshot(healthRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ success: true, data: snapshot.data() });
        } else {
          callback({ success: false, error: 'No asset health data found' });
        }
      },
      (error) => {
        console.error('Error subscribing to asset health:', error);
        callback({ success: false, error: error.message });
      }
    );
  }

  // ============================================
  // USER PROFILE - CRUD OPERATIONS
  // ============================================

  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(userId, data) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  subscribeToUserProfile(userId, callback) {
    const userRef = doc(db, 'users', userId);

    return onSnapshot(userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ success: true, data: snapshot.data() });
        } else {
          callback({ success: false, error: 'User not found' });
        }
      },
      (error) => {
        console.error('Error subscribing to user profile:', error);
        callback({ success: false, error: error.message });
      }
    );
  }

  // ============================================
  // SETTINGS
  // ============================================

  async getUserSettings(userId) {
    try {
      const settingsRef = doc(db, 'settings', userId);
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        return { success: true, data: settingsSnap.data() };
      } else {
        return {
          success: true,
          data: {
            notifications: true,
            emailAlerts: true,
            darkMode: false,
            biometric: false,
            autoSync: true,
            language: 'en'
          }
        };
      }
    } catch (error) {
      console.error('Error getting user settings:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserSettings(userId, settings) {
    try {
      const settingsRef = doc(db, 'settings', userId);
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return { success: true };
    } catch (error) {
      console.error('Error updating user settings:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // STORAGE
  // ============================================

  async uploadProfileImage(userId, imageUri) {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profiles/${userId}/avatar.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return { success: false, error: error.message };
    }
  }
}

// Exportar instancia unica (Singleton)
export default new RealTimeDataService();
