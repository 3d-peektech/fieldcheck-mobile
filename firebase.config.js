// firebase.config.js
// Firebase Configuration for FieldCheck AI

/**
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create a new project or select existing
 * 3. Go to Project Settings → General
 * 4. Scroll to "Your apps" section
 * 5. Click on the web icon (</>)
 * 6. Copy the config values and paste below
 * 7. For Android: Download google-services.json and place in android/app/
 */

// ============================================
// 🔥 YOUR FIREBASE CONFIGURATION
// ============================================
// ✅ Esta es tu configuración REAL - Ya está lista!
export const firebaseConfig = {
  apiKey: "AIzaSyBY3EjKQ52mfAcM8zaMD7vmzWKFALlR0Q8",
  authDomain: "fieldcheck-ai-28fb0.firebaseapp.com",
  projectId: "fieldcheck-ai-28fb0",
  storageBucket: "fieldcheck-ai-28fb0.firebasestorage.app",
  messagingSenderId: "1089890325602",
  appId: "1:1089890325602:web:9d60add7b7201e5c58ed3b", // ← Reemplaza con tu appId completo
  measurementId: "G-BXW0JJJG44" // ← Reemplaza con tu measurementId si lo tienes
};

// ============================================
// 📊 FIREBASE COLLECTIONS STRUCTURE
// ============================================
export const COLLECTIONS = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
  ASSETS: 'assets',
  INSPECTIONS: 'inspections',
  REPORTS: 'reports',
  TEAMS: 'teams'
};

// ============================================
// 📄 FIREBASE DOCUMENT IDs (for dashboard collection)
// ============================================
export const DASHBOARD_DOCS = {
  KPIS: 'kpis',
  REVENUE_7D: 'revenue_7d',
  REVENUE_30D: 'revenue_30d',
  REVENUE_90D: 'revenue_90d',
  REVENUE_1Y: 'revenue_1y',
  ASSET_HEALTH: 'asset_health',
  INSPECTIONS: 'inspections',
  NOTIFICATIONS: 'notifications',
  QUICK_STATS: 'quick_stats'
};

// ============================================
// 📁 FIREBASE STORAGE PATHS
// ============================================
export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  REPORTS: 'reports',
  ASSETS: 'assets',
  INSPECTIONS: 'inspections',
  PROFILES: 'profiles'
};

// ============================================
// ⚙️ FIRESTORE SETTINGS
// ============================================
export const FIRESTORE_SETTINGS = {
  cacheSizeBytes: 50 * 1024 * 1024, // 50 MB
  persistence: true
};

// ============================================
// 🌍 ENVIRONMENT-SPECIFIC CONFIGS
// ============================================
export const ENV = {
  development: {
    ...firebaseConfig,
    enablePersistence: true,
    useEmulator: false
  },
  production: {
    ...firebaseConfig,
    enablePersistence: true,
    useEmulator: false
  }
};

// ============================================
// 🎯 GET CONFIG BASED ON ENVIRONMENT
// ============================================
export const getFirebaseConfig = () => {
  const isDevelopment = __DEV__;
  return isDevelopment ? ENV.development : ENV.production;
};

export default firebaseConfig;