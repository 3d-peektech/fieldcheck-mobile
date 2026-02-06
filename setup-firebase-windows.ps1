# 🚀 FIELDCHECK AI - FIREBASE SETUP AUTOMATIZADO (WINDOWS)
# Este script configura TODO automáticamente
# Ejecuta con: .\setup-firebase-windows.ps1

Write-Host "🚀 INICIANDO CONFIGURACIÓN DE FIREBASE..." -ForegroundColor Cyan
Write-Host ""

# ============================================
# PASO 1: VERIFICAR PREREQUISITOS
# ============================================
Write-Host "📋 PASO 1: Verificando prerequisitos..." -ForegroundColor Cyan

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Instala desde: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm instalado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# PASO 2: CREAR ESTRUCTURA DE CARPETAS
# ============================================
Write-Host "📁 PASO 2: Creando estructura de carpetas..." -ForegroundColor Cyan

$folders = @(
    "src\config",
    "src\services",
    "src\screens",
    "docs",
    "android\app"
)

foreach ($folder in $folders) {
    if (-Not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "✅ Creado: $folder" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Ya existe: $folder" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================
# PASO 3: INSTALAR DEPENDENCIAS DE FIREBASE
# ============================================
Write-Host "📦 PASO 3: Instalando dependencias de Firebase..." -ForegroundColor Cyan
Write-Host "⏳ Esto puede tomar 2-3 minutos..." -ForegroundColor Yellow

npm install firebase@^10.7.0 `
    @react-native-firebase/app@^18.7.0 `
    @react-native-firebase/firestore@^18.7.0 `
    @react-native-firebase/auth@^18.7.0 `
    @react-native-firebase/storage@^18.7.0 `
    --save

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# PASO 4: CREAR ARCHIVO DE CONFIGURACIÓN
# ============================================
Write-Host "🔥 PASO 4: Creando archivo de configuración de Firebase..." -ForegroundColor Cyan

$firebaseConfig = @'
// 🔥 FIREBASE CONFIGURATION
// Reemplaza estos valores con los de tu proyecto Firebase
// Los encuentras en: Firebase Console > Project Settings > General > Your apps

export const firebaseConfig = {
  // 🔑 REEMPLAZA ESTOS VALORES CON LOS TUYOS
  apiKey: "AIzaSy-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Para obtener tu configuración:
// 1. Ve a: https://console.firebase.google.com/
// 2. Selecciona tu proyecto (o crea uno nuevo)
// 3. Ve a Project Settings (icono de engranaje) > General
// 4. Scroll down hasta "Your apps"
// 5. Si no tienes una app web, haz clic en <web> para agregar una
// 6. Copia la configuración que aparece
'@

Set-Content -Path "src\config\firebase.config.js" -Value $firebaseConfig -Encoding UTF8
Write-Host "✅ Archivo creado: src\config\firebase.config.js" -ForegroundColor Green
Write-Host "⚠️  IMPORTANTE: Edita este archivo con tus credenciales de Firebase" -ForegroundColor Yellow

Write-Host ""

# ============================================
# PASO 5: CREAR SERVICIO DE DATOS
# ============================================
Write-Host "🔧 PASO 5: Creando servicio de datos en tiempo real..." -ForegroundColor Cyan

$serviceContent = @'
// 🔥 REAL-TIME DATA SERVICE
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

  /**
   * Subscribirse a KPIs en tiempo real
   * @param {Function} callback - Función que recibe los datos actualizados
   * @returns {Function} - Función para cancelar la subscripción
   */
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

  /**
   * Subscribirse a datos de gráfico de ingresos
   * @param {string} range - '7d' o '30d'
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
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

  /**
   * Subscribirse a salud de assets
   */
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

  /**
   * Obtener perfil de usuario
   * @param {string} userId
   */
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

  /**
   * Actualizar perfil de usuario
   * @param {string} userId
   * @param {Object} data
   */
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

  /**
   * Subscribirse a perfil de usuario (tiempo real)
   */
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

// Exportar instancia única (Singleton)
export default new RealTimeDataService();
'@

Set-Content -Path "src\services\RealTimeDataService.js" -Value $serviceContent -Encoding UTF8
Write-Host "✅ Servicio creado: src\services\RealTimeDataService.js" -ForegroundColor Green

Write-Host ""

# ============================================
# PASO 6: CREAR GUÍA
# ============================================
Write-Host "📖 PASO 6: Creando guía de implementación..." -ForegroundColor Cyan

$guide = @'
# 🚀 IMPLEMENTACIÓN FIREBASE - FIELDCHECK AI

## ✅ LO QUE YA ESTÁ HECHO

- ✅ Estructura de carpetas creada
- ✅ Dependencias de Firebase instaladas
- ✅ Servicio de datos en tiempo real creado
- ✅ Archivo de configuración de Firebase creado

---

## 📋 PASOS SIGUIENTES (15 minutos)

### PASO 1: Configurar Firebase Console (10 min)

1. **Crear proyecto Firebase:**
   - Ve a: https://console.firebase.google.com/
   - Click "Add Project"
   - Nombre: "FieldCheck-AI"
   - Completa el wizard

2. **Añadir app Android:**
   - En el proyecto, click en el ícono de Android
   - Android package name: `com.fieldcheck.ai`
   - Download `google-services.json`
   - Colócalo en: `android\app\google-services.json`

3. **Activar Firestore:**
   - Menú lateral → Build → Firestore Database
   - "Create database"
   - Start in **test mode**

4. **Activar Authentication:**
   - Menú lateral → Build → Authentication
   - "Get started"
   - Enable "Email/Password"

5. **Activar Storage:**
   - Menú lateral → Build → Storage
   - "Get started"

### PASO 2: Actualizar Configuración (2 min)

1. En Firebase Console → Project Settings → General
2. Copia la configuración de tu app web
3. Actualiza `src\config\firebase.config.js`

### PASO 3: Configurar Android (3 min)

1. **Edita `android\build.gradle`:**
   ```gradle
   buildscript {
       dependencies {
           classpath 'com.google.gms:google-services:4.4.0'
       }
   }
   ```

2. **Edita `android\app\build.gradle`:**
   ```gradle
   // Al final del archivo
   apply plugin: 'com.google.gms.google-services'
   ```

---

## 🎯 USO DEL SERVICIO

```typescript
import RealTimeDataService from '../services/RealTimeDataService';

// Subscribirse a datos en tiempo real
useEffect(() => {
  const unsubscribe = RealTimeDataService.subscribeToKPIs((result) => {
    if (result.success) {
      setKpis(result.data);
    }
  });

  return () => unsubscribe();
}, []);
```

---

## 🎉 ¡LISTO!

Ahora solo necesitas:
1. Configurar Firebase Console
2. Actualizar credenciales
3. Colocar google-services.json
'@

Set-Content -Path "docs\PASOS_SIGUIENTES.md" -Value $guide -Encoding UTF8
Write-Host "✅ Guía creada: docs\PASOS_SIGUIENTES.md" -ForegroundColor Green

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ ¡CONFIGURACIÓN COMPLETADA!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Archivos creados:" -ForegroundColor Cyan
Write-Host "  ✅ src\config\firebase.config.js"
Write-Host "  ✅ src\services\RealTimeDataService.js"
Write-Host "  ✅ docs\PASOS_SIGUIENTES.md"
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. Lee: docs\PASOS_SIGUIENTES.md"
Write-Host "  2. Configura Firebase Console (15 min)"
Write-Host "  3. Actualiza src\config\firebase.config.js"
Write-Host "  4. Coloca google-services.json en android\app\"
Write-Host ""
Write-Host "🔥 Tu backend está listo para datos en tiempo real!" -ForegroundColor Green
Write-Host ""