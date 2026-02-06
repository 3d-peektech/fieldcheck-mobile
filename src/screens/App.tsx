// App.tsx - React Native Version
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import icons (using react-native-vector-icons)
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [language, setLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');

  // Load preferences
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      const savedNotifications = await AsyncStorage.getItem('notifications');

      if (savedLanguage) setLanguage(savedLanguage);
      if (savedDarkMode) setIsDarkMode(savedDarkMode === 'true');
      if (savedNotifications) setNotifications(savedNotifications === 'true');
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreference = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  // Translations
  const translations = {
    en: {
      home: 'Home',
      aiInsights: 'AI Insights',
      assets: 'Assets',
      profile: 'Profile',
      welcome: 'Welcome Back',
      activeAssets: 'Active Assets',
      completedInspections: 'Completed Inspections',
      pendingReports: 'Pending Reports',
      complianceRate: 'Compliance Rate',
      aiPredictions: 'AI Predictions',
      recentActivity: 'Recent Activity',
      scanAsset: 'Scan Asset',
      generateReport: 'Generate Report',
      viewAll: 'View All',
      notifications: 'Notifications',
      darkMode: 'Dark Mode',
      language: 'Language',
      upgrade: 'Upgrade Now',
      freeTrial: 'Free Trial',
      daysLeft: 'days left',
      unlockFeatures: 'Upgrade to unlock all features',
    },
    es: {
      home: 'Inicio',
      aiInsights: 'Insights de IA',
      assets: 'Activos',
      profile: 'Perfil',
      welcome: 'Bienvenido',
      activeAssets: 'Activos Activos',
      completedInspections: 'Inspecciones Completadas',
      pendingReports: 'Informes Pendientes',
      complianceRate: 'Tasa de Cumplimiento',
      aiPredictions: 'Predicciones IA',
      recentActivity: 'Actividad Reciente',
      scanAsset: 'Escanear Activo',
      generateReport: 'Generar Informe',
      viewAll: 'Ver Todo',
      notifications: 'Notificaciones',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      upgrade: 'Actualizar Ahora',
      freeTrial: 'Prueba Gratuita',
      daysLeft: 'días restantes',
      unlockFeatures: 'Actualiza para desbloquear todas las funciones',
    },
    fr: {
      home: 'Accueil',
      aiInsights: 'Insights IA',
      assets: 'Actifs',
      profile: 'Profil',
      welcome: 'Bon Retour',
      activeAssets: 'Actifs Actifs',
      completedInspections: 'Inspections Terminées',
      pendingReports: 'Rapports en Attente',
      complianceRate: 'Taux de Conformité',
      aiPredictions: 'Prédictions IA',
      recentActivity: 'Activité Récente',
      scanAsset: 'Scanner Actif',
      generateReport: 'Générer Rapport',
      viewAll: 'Voir Tout',
      notifications: 'Notifications',
      darkMode: 'Mode Sombre',
      language: 'Langue',
      upgrade: 'Mettre à Niveau',
      freeTrial: 'Essai Gratuit',
      daysLeft: 'jours restants',
      unlockFeatures: 'Mettre à niveau pour débloquer',
    },
    de: {
      home: 'Startseite',
      aiInsights: 'KI-Einblicke',
      assets: 'Anlagen',
      profile: 'Profil',
      welcome: 'Willkommen Zurück',
      activeAssets: 'Aktive Anlagen',
      completedInspections: 'Abgeschlossene Inspektionen',
      pendingReports: 'Ausstehende Berichte',
      complianceRate: 'Compliance-Rate',
      aiPredictions: 'KI-Vorhersagen',
      recentActivity: 'Letzte Aktivität',
      scanAsset: 'Anlage Scannen',
      generateReport: 'Bericht Erstellen',
      viewAll: 'Alle Anzeigen',
      notifications: 'Benachrichtigungen',
      darkMode: 'Dunkler Modus',
      language: 'Sprache',
      upgrade: 'Jetzt Upgraden',
      freeTrial: 'Kostenlose Testversion',
      daysLeft: 'Tage übrig',
      unlockFeatures: 'Upgraden Sie',
    },
    pt: {
      home: 'Início',
      aiInsights: 'Insights de IA',
      assets: 'Ativos',
      profile: 'Perfil',
      welcome: 'Bem-vindo',
      activeAssets: 'Ativos Ativos',
      completedInspections: 'Inspeções Concluídas',
      pendingReports: 'Relatórios Pendentes',
      complianceRate: 'Taxa de Conformidade',
      aiPredictions: 'Previsões de IA',
      recentActivity: 'Atividade Recente',
      scanAsset: 'Escanear Ativo',
      generateReport: 'Gerar Relatório',
      viewAll: 'Ver Tudo',
      notifications: 'Notificações',
      darkMode: 'Modo Escuro',
      language: 'Idioma',
      upgrade: 'Atualizar Agora',
      freeTrial: 'Teste Gratuito',
      daysLeft: 'dias restantes',
      unlockFeatures: 'Atualize para desbloquear',
    },
    nl: {
      home: 'Home',
      aiInsights: 'AI Inzichten',
      assets: 'Assets',
      profile: 'Profiel',
      welcome: 'Welkom Terug',
      activeAssets: 'Actieve Assets',
      completedInspections: 'Voltooide Inspecties',
      pendingReports: 'Openstaande Rapporten',
      complianceRate: 'Compliance Rate',
      aiPredictions: 'AI Voorspellingen',
      recentActivity: 'Recente Activiteit',
      scanAsset: 'Asset Scannen',
      generateReport: 'Rapport Genereren',
      viewAll: 'Alles Bekijken',
      notifications: 'Meldingen',
      darkMode: 'Donkere Modus',
      language: 'Taal',
      upgrade: 'Nu Upgraden',
      freeTrial: 'Gratis Proefperiode',
      daysLeft: 'dagen over',
      unlockFeatures: 'Upgrade om te ontgrendelen',
    },
    ar: {
      home: 'الرئيسية',
      aiInsights: 'رؤى الذكاء الاصطناعي',
      assets: 'الأصول',
      profile: 'الملف الشخصي',
      welcome: 'مرحبا بعودتك',
      activeAssets: 'الأصول النشطة',
      completedInspections: 'الفحوصات المكتملة',
      pendingReports: 'التقارير المعلقة',
      complianceRate: 'معدل الامتثال',
      aiPredictions: 'توقعات الذكاء الاصطناعي',
      recentActivity: 'النشاط الأخير',
      scanAsset: 'مسح الأصول',
      generateReport: 'إنشاء تقرير',
      viewAll: 'عرض الكل',
      notifications: 'الإشعارات',
      darkMode: 'الوضع الداكن',
      language: 'اللغة',
      upgrade: 'ترقية الآن',
      freeTrial: 'تجربة مجانية',
      daysLeft: 'أيام متبقية',
      unlockFeatures: 'قم بالترقية لفتح',
    },
  };

  const t = translations[language] || translations.en;

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  // Mock data
  const aiInsights = [
    {
      id: 1,
      title: 'Asset Maintenance Alert',
      description: 'Equipment A-247 likely needs maintenance in 7 days',
      priority: 'high',
      confidence: 94,
    },
    {
      id: 2,
      title: 'Cost Optimization',
      description: 'Consolidating inspections could save 23% in costs',
      priority: 'medium',
      confidence: 87,
    },
  ];

  // Home Screen
  const HomeScreen = () => (
    <ScrollView style={styles.screenContent}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeTitle, isDarkMode && styles.darkText]}>
            {t.welcome}
          </Text>
          <Text style={styles.welcomeSubtitle}>Dashboard Overview</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bell" size={20} color={isDarkMode ? '#fff' : '#000'} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.statCard}
        >
          <Icon name="target" size={24} color="#fff" />
          <Text style={styles.statLabel}>{t.activeAssets}</Text>
          <Text style={styles.statValue}>247</Text>
          <Text style={styles.statChange}>+12%</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.statCard}
        >
          <Icon name="check-circle" size={24} color="#fff" />
          <Text style={styles.statLabel}>{t.completedInspections}</Text>
          <Text style={styles.statValue}>1,429</Text>
          <Text style={styles.statChange}>+8%</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#f59e0b', '#d97706']}
          style={styles.statCard}
        >
          <Icon name="file-text" size={24} color="#fff" />
          <Text style={styles.statLabel}>{t.pendingReports}</Text>
          <Text style={styles.statValue}>23</Text>
          <Text style={styles.statChange}>-5%</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          style={styles.statCard}
        >
          <Icon name="shield" size={24} color="#fff" />
          <Text style={styles.statLabel}>{t.complianceRate}</Text>
          <Text style={styles.statValue}>98.5%</Text>
          <Text style={styles.statChange}>+2.3%</Text>
        </LinearGradient>
      </View>

      <View style={[styles.sectionCard, isDarkMode && styles.darkCard]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t.aiPredictions}
          </Text>
          <TouchableOpacity>
            <Text style={styles.textButton}>{t.viewAll}</Text>
          </TouchableOpacity>
        </View>

        {aiInsights.map((insight) => (
          <View key={insight.id} style={styles.predictionItem}>
            <View style={[styles.predictionIcon, { backgroundColor: insight.priority === 'high' ? '#fee2e2' : '#fef3c7' }]}>
              <Icon name="zap" size={20} color={insight.priority === 'high' ? '#dc2626' : '#d97706'} />
            </View>
            <View style={styles.predictionContent}>
              <Text style={[styles.predictionTitle, isDarkMode && styles.darkText]}>
                {insight.title}
              </Text>
              <Text style={styles.predictionDescription}>
                {insight.description}
              </Text>
              <Text style={styles.confidence}>{insight.confidence}% confidence</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.buttonGradient}
          >
            <Icon name="camera" size={20} color="#fff" />
            <Text style={styles.buttonText}>{t.scanAsset}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryButton, isDarkMode && styles.darkButton]}>
          <Icon name="file-text" size={20} color="#667eea" />
          <Text style={styles.secondaryButtonText}>{t.generateReport}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // AI Insights Screen
  const AIInsightsScreen = () => (
    <ScrollView style={styles.screenContent}>
      <View style={styles.header}>
        <Text style={[styles.welcomeTitle, isDarkMode && styles.darkText]}>
          {t.aiInsights}
        </Text>
      </View>

      <View style={styles.aiGrid}>
        {[
          { icon: 'zap', title: t.aiPredictions },
          { icon: 'star', title: 'Smart Recommendations' },
          { icon: 'trending-up', title: 'Risk Analysis' },
        ].map((feature, index) => (
          <View key={index} style={[styles.aiCard, isDarkMode && styles.darkCard]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.aiIcon}
            >
              <Icon name={feature.icon} size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.aiCardTitle, isDarkMode && styles.darkText]}>
              {feature.title}
            </Text>
          </View>
        ))}
      </View>

      {aiInsights.map((insight) => (
        <View key={insight.id} style={[styles.insightCard, isDarkMode && styles.darkCard]}>
          <View style={styles.insightHeader}>
            <View style={styles.insightBadge}>
              <Icon name="zap" size={16} color="#667eea" />
              <Text style={styles.insightBadgeText}>prediction</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: insight.priority === 'high' ? '#fee2e2' : '#fef3c7' }]}>
              <Text style={[styles.priorityText, { color: insight.priority === 'high' ? '#dc2626' : '#d97706' }]}>
                {insight.priority}
              </Text>
            </View>
          </View>
          <Text style={[styles.insightTitle, isDarkMode && styles.darkText]}>
            {insight.title}
          </Text>
          <Text style={styles.insightDescription}>{insight.description}</Text>
          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, { width: `${insight.confidence}%` }]} />
            </View>
            <Text style={styles.confidenceText}>{insight.confidence}%</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  // Assets Screen
  const AssetsScreen = () => (
    <ScrollView style={styles.screenContent}>
      <View style={styles.header}>
        <Text style={[styles.welcomeTitle, isDarkMode && styles.darkText]}>
          {t.assets}
        </Text>
      </View>

      <View style={[styles.searchBar, isDarkMode && styles.darkCard]}>
        <Icon name="search" size={20} color="#94a3b8" />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkText]}
          placeholder="Search assets..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {[
        { id: 'A-247', name: 'HVAC System', status: 'active', health: 94 },
        { id: 'B-143', name: 'Elevator Unit', status: 'maintenance', health: 67 },
        { id: 'C-892', name: 'Fire System', status: 'active', health: 98 },
      ].map((asset) => (
        <View key={asset.id} style={[styles.assetCard, isDarkMode && styles.darkCard]}>
          <View style={styles.assetHeader}>
            <View>
              <Text style={[styles.assetName, isDarkMode && styles.darkText]}>
                {asset.name}
              </Text>
              <Text style={styles.assetId}>{asset.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: asset.status === 'active' ? '#d1fae5' : '#fef3c7' }]}>
              <Text style={[styles.statusText, { color: asset.status === 'active' ? '#059669' : '#d97706' }]}>
                {asset.status}
              </Text>
            </View>
          </View>
          <View style={styles.healthContainer}>
            <View style={styles.healthBar}>
              <View
                style={[
                  styles.healthFill,
                  {
                    width: `${asset.health}%`,
                    backgroundColor: asset.health > 80 ? '#10b981' : asset.health > 60 ? '#f59e0b' : '#ef4444',
                  },
                ]}
              />
            </View>
            <Text style={styles.healthValue}>{asset.health}%</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  // Profile Screen
  const ProfileScreen = () => (
    <ScrollView style={styles.screenContent}>
      <View style={styles.header}>
        <Text style={[styles.welcomeTitle, isDarkMode && styles.darkText]}>
          {t.profile}
        </Text>
      </View>

      <View style={[styles.profileHeader, isDarkMode && styles.darkCard]}>
        <View style={styles.profileAvatar}>
          <Icon name="user" size={48} color="#fff" />
        </View>
        <Text style={[styles.profileName, isDarkMode && styles.darkText]}>
          John Anderson
        </Text>
        <Text style={styles.profileEmail}>john.anderson@fieldcheck.com</Text>
      </View>

      <View style={[styles.settingsSection, isDarkMode && styles.darkCard]}>
        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.settingsLeft}>
            <View style={styles.settingsIcon}>
              <Icon name="bell" size={20} color="#667eea" />
            </View>
            <Text style={[styles.settingsText, isDarkMode && styles.darkText]}>
              {t.notifications}
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={(value) => {
              setNotifications(value);
              savePreference('notifications', value.toString());
            }}
            trackColor={{ false: '#cbd5e1', true: '#667eea' }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.settingsLeft}>
            <View style={styles.settingsIcon}>
              <Icon name="moon" size={20} color="#667eea" />
            </View>
            <Text style={[styles.settingsText, isDarkMode && styles.darkText]}>
              {t.darkMode}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => {
              setIsDarkMode(value);
              savePreference('darkMode', value.toString());
            }}
            trackColor={{ false: '#cbd5e1', true: '#667eea' }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => setShowLanguageModal(true)}
        >
          <View style={styles.settingsLeft}>
            <View style={styles.settingsIcon}>
              <Icon name="globe" size={20} color="#667eea" />
            </View>
            <Text style={[styles.settingsText, isDarkMode && styles.darkText]}>
              {t.language}
            </Text>
          </View>
          <View style={styles.settingsRight}>
            <Text style={styles.currentValue}>
              {languages.find((l) => l.code === language)?.name}
            </Text>
            <Icon name="chevron-right" size={20} color="#cbd5e1" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.subscriptionCard, isDarkMode && styles.darkCard]}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.subscriptionGradient}>
          <View style={styles.subscriptionHeader}>
            <Icon name="award" size={24} color="#fff" />
            <View>
              <Text style={styles.subscriptionTitle}>{t.freeTrial}</Text>
              <Text style={styles.trialDays}>3 {t.daysLeft}</Text>
            </View>
          </View>
          <Text style={styles.subscriptionText}>{t.unlockFeatures}</Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => setShowUpgradeModal(true)}
          >
            <Text style={styles.upgradeButtonText}>{t.upgrade}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );

  // Language Modal
  const LanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDarkMode && styles.darkCard]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              {t.language}
            </Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Icon name="x" size={24} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  language === lang.code && styles.languageItemActive,
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  savePreference('language', lang.code);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[styles.languageName, isDarkMode && styles.darkText]}>
                  {lang.name}
                </Text>
                {language === lang.code && (
                  <Icon name="check-circle" size={20} color="#667eea" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <View style={[styles.bottomNav, isDarkMode && styles.darkBottomNav]}>
      {[
        { screen: 'home', icon: 'home', label: t.home },
        { screen: 'ai', icon: 'zap', label: t.aiInsights },
        { screen: 'assets', icon: 'bar-chart-2', label: t.assets },
        { screen: 'profile', icon: 'user', label: t.profile },
      ].map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={[
            styles.navItem,
            currentScreen === item.screen && styles.navItemActive,
          ]}
          onPress={() => setCurrentScreen(item.screen)}
        >
          <Icon
            name={item.icon}
            size={24}
            color={currentScreen === item.screen ? '#667eea' : '#94a3b8'}
          />
          <Text
            style={[
              styles.navLabel,
              currentScreen === item.screen && styles.navLabelActive,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'ai' && <AIInsightsScreen />}
      {currentScreen === 'assets' && <AssetsScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      <BottomNav />
      <LanguageModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#0f172a',
  },
  screenContent: {
    flex: 1,
    padding: 20,
    marginBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  darkText: {
    color: '#f1f5f9',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    padding: 20,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
    opacity: 0.9,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: '#1e293b',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  textButton: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  predictionItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
  },
  predictionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionContent: {
    flex: 1,
  },
  predictionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  predictionDescription: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  confidence: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  darkButton: {
    backgroundColor: '#1e293b',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '600',
  },
  aiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  aiCard: {
    width: (width - 64) / 3,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  aiIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  insightBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  priorityBadge: {
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  assetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  assetId: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  healthFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  profileHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentValue: {
    fontSize: 14,
    color: '#64748b',
  },
  subscriptionCard: {
    marginBottom: 16,
  },
  subscriptionGradient: {
    borderRadius: 16,
    padding: 24,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  trialDays: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  languageItemActive: {
    backgroundColor: '#ede9fe',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  languageFlag: {
    fontSize: 28,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  darkBottomNav: {
    backgroundColor: '#1e293b',
    borderTopColor: '#334155',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#ede9fe',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  navLabelActive: {
    color: '#667eea',
  },
});

export default App;