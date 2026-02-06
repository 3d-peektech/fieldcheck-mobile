import React, { useState, useEffect } from 'react';
import { 
  Camera, Home, BarChart3, Sparkles, User, Bell, Globe, 
  Moon, Sun, TrendingUp, AlertCircle, CheckCircle, 
  Zap, Brain, Target, DollarSign, Calendar, FileText,
  Settings, LogOut, CreditCard, Shield, Award,
  Activity, PieChart, LineChart, Users, MessageSquare,
  Search, Filter, Download, Upload, Share2, Eye,
  Lock, Unlock, ChevronRight, Plus, Menu, X
} from 'lucide-react';

const FieldCheckApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [language, setLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [aiInsights, setAiInsights] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Translations object
  const translations = {
    en: {
      home: 'Home',
      aiInsights: 'AI Insights',
      assets: 'Assets',
      profile: 'Profile',
      settings: 'Settings',
      upgrade: 'Upgrade Now',
      freeTrial: 'Free Trial',
      daysLeft: 'days left',
      unlockFeatures: 'Upgrade to unlock all features',
      companySettings: 'Company Settings',
      changePassword: 'Change Password',
      notifications: 'Notifications',
      darkMode: 'Dark Mode',
      language: 'Language',
      subscription: 'Subscription',
      preferences: 'Preferences',
      welcome: 'Welcome Back',
      dashboardOverview: 'Dashboard Overview',
      activeAssets: 'Active Assets',
      completedInspections: 'Completed Inspections',
      pendingReports: 'Pending Reports',
      complianceRate: 'Compliance Rate',
      recentActivity: 'Recent Activity',
      aiPredictions: 'AI Predictions',
      smartRecommendations: 'Smart Recommendations',
      riskAnalysis: 'Risk Analysis',
      generateReport: 'Generate Report',
      scanAsset: 'Scan Asset',
      viewAll: 'View All',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save',
      selectPlan: 'Select Plan',
      currentPlan: 'Current Plan',
      basic: 'Basic',
      professional: 'Professional',
      enterprise: 'Enterprise'
    },
    es: {
      home: 'Inicio',
      aiInsights: 'Insights de IA',
      assets: 'Activos',
      profile: 'Perfil',
      settings: 'Configuración',
      upgrade: 'Actualizar Ahora',
      freeTrial: 'Prueba Gratuita',
      daysLeft: 'días restantes',
      unlockFeatures: 'Actualiza para desbloquear todas las funciones',
      companySettings: 'Configuración de Empresa',
      changePassword: 'Cambiar Contraseña',
      notifications: 'Notificaciones',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      subscription: 'Suscripción',
      preferences: 'Preferencias',
      welcome: 'Bienvenido de Nuevo',
      dashboardOverview: 'Vista General',
      activeAssets: 'Activos Activos',
      completedInspections: 'Inspecciones Completadas',
      pendingReports: 'Informes Pendientes',
      complianceRate: 'Tasa de Cumplimiento',
      recentActivity: 'Actividad Reciente',
      aiPredictions: 'Predicciones IA',
      smartRecommendations: 'Recomendaciones Inteligentes',
      riskAnalysis: 'Análisis de Riesgo',
      generateReport: 'Generar Informe',
      scanAsset: 'Escanear Activo',
      viewAll: 'Ver Todo',
      monthly: 'Mensual',
      yearly: 'Anual',
      save: 'Guardar',
      selectPlan: 'Seleccionar Plan',
      currentPlan: 'Plan Actual',
      basic: 'Básico',
      professional: 'Profesional',
      enterprise: 'Empresarial'
    },
    fr: {
      home: 'Accueil',
      aiInsights: 'Insights IA',
      assets: 'Actifs',
      profile: 'Profil',
      settings: 'Paramètres',
      upgrade: 'Mettre à Niveau',
      freeTrial: 'Essai Gratuit',
      daysLeft: 'jours restants',
      unlockFeatures: 'Mettre à niveau pour débloquer toutes les fonctionnalités',
      companySettings: 'Paramètres Entreprise',
      changePassword: 'Changer le Mot de Passe',
      notifications: 'Notifications',
      darkMode: 'Mode Sombre',
      language: 'Langue',
      subscription: 'Abonnement',
      preferences: 'Préférences',
      welcome: 'Bon Retour',
      dashboardOverview: 'Vue d\'Ensemble',
      activeAssets: 'Actifs Actifs',
      completedInspections: 'Inspections Terminées',
      pendingReports: 'Rapports en Attente',
      complianceRate: 'Taux de Conformité',
      recentActivity: 'Activité Récente',
      aiPredictions: 'Prédictions IA',
      smartRecommendations: 'Recommandations Intelligentes',
      riskAnalysis: 'Analyse des Risques',
      generateReport: 'Générer Rapport',
      scanAsset: 'Scanner Actif',
      viewAll: 'Voir Tout',
      monthly: 'Mensuel',
      yearly: 'Annuel',
      save: 'Économiser',
      selectPlan: 'Sélectionner Plan',
      currentPlan: 'Plan Actuel',
      basic: 'Basique',
      professional: 'Professionnel',
      enterprise: 'Entreprise'
    },
    de: {
      home: 'Startseite',
      aiInsights: 'KI-Einblicke',
      assets: 'Anlagen',
      profile: 'Profil',
      settings: 'Einstellungen',
      upgrade: 'Jetzt Upgraden',
      freeTrial: 'Kostenlose Testversion',
      daysLeft: 'Tage übrig',
      unlockFeatures: 'Upgraden Sie, um alle Funktionen freizuschalten',
      companySettings: 'Firmeneinstellungen',
      changePassword: 'Passwort Ändern',
      notifications: 'Benachrichtigungen',
      darkMode: 'Dunkler Modus',
      language: 'Sprache',
      subscription: 'Abonnement',
      preferences: 'Einstellungen',
      welcome: 'Willkommen Zurück',
      dashboardOverview: 'Dashboard-Übersicht',
      activeAssets: 'Aktive Anlagen',
      completedInspections: 'Abgeschlossene Inspektionen',
      pendingReports: 'Ausstehende Berichte',
      complianceRate: 'Compliance-Rate',
      recentActivity: 'Letzte Aktivität',
      aiPredictions: 'KI-Vorhersagen',
      smartRecommendations: 'Intelligente Empfehlungen',
      riskAnalysis: 'Risikoanalyse',
      generateReport: 'Bericht Erstellen',
      scanAsset: 'Anlage Scannen',
      viewAll: 'Alle Anzeigen',
      monthly: 'Monatlich',
      yearly: 'Jährlich',
      save: 'Sparen',
      selectPlan: 'Plan Wählen',
      currentPlan: 'Aktueller Plan',
      basic: 'Basic',
      professional: 'Professional',
      enterprise: 'Enterprise'
    },
    pt: {
      home: 'Início',
      aiInsights: 'Insights de IA',
      assets: 'Ativos',
      profile: 'Perfil',
      settings: 'Configurações',
      upgrade: 'Atualizar Agora',
      freeTrial: 'Teste Gratuito',
      daysLeft: 'dias restantes',
      unlockFeatures: 'Atualize para desbloquear todos os recursos',
      companySettings: 'Configurações da Empresa',
      changePassword: 'Alterar Senha',
      notifications: 'Notificações',
      darkMode: 'Modo Escuro',
      language: 'Idioma',
      subscription: 'Assinatura',
      preferences: 'Preferências',
      welcome: 'Bem-vindo de Volta',
      dashboardOverview: 'Visão Geral',
      activeAssets: 'Ativos Ativos',
      completedInspections: 'Inspeções Concluídas',
      pendingReports: 'Relatórios Pendentes',
      complianceRate: 'Taxa de Conformidade',
      recentActivity: 'Atividade Recente',
      aiPredictions: 'Previsões de IA',
      smartRecommendations: 'Recomendações Inteligentes',
      riskAnalysis: 'Análise de Risco',
      generateReport: 'Gerar Relatório',
      scanAsset: 'Escanear Ativo',
      viewAll: 'Ver Tudo',
      monthly: 'Mensal',
      yearly: 'Anual',
      save: 'Economizar',
      selectPlan: 'Selecionar Plano',
      currentPlan: 'Plano Atual',
      basic: 'Básico',
      professional: 'Profissional',
      enterprise: 'Empresarial'
    },
    nl: {
      home: 'Home',
      aiInsights: 'AI Inzichten',
      assets: 'Assets',
      profile: 'Profiel',
      settings: 'Instellingen',
      upgrade: 'Nu Upgraden',
      freeTrial: 'Gratis Proefperiode',
      daysLeft: 'dagen over',
      unlockFeatures: 'Upgrade om alle functies te ontgrendelen',
      companySettings: 'Bedrijfsinstellingen',
      changePassword: 'Wachtwoord Wijzigen',
      notifications: 'Meldingen',
      darkMode: 'Donkere Modus',
      language: 'Taal',
      subscription: 'Abonnement',
      preferences: 'Voorkeuren',
      welcome: 'Welkom Terug',
      dashboardOverview: 'Dashboard Overzicht',
      activeAssets: 'Actieve Assets',
      completedInspections: 'Voltooide Inspecties',
      pendingReports: 'Openstaande Rapporten',
      complianceRate: 'Compliance Rate',
      recentActivity: 'Recente Activiteit',
      aiPredictions: 'AI Voorspellingen',
      smartRecommendations: 'Slimme Aanbevelingen',
      riskAnalysis: 'Risicoanalyse',
      generateReport: 'Rapport Genereren',
      scanAsset: 'Asset Scannen',
      viewAll: 'Alles Bekijken',
      monthly: 'Maandelijks',
      yearly: 'Jaarlijks',
      save: 'Besparen',
      selectPlan: 'Plan Selecteren',
      currentPlan: 'Huidig Plan',
      basic: 'Basis',
      professional: 'Professioneel',
      enterprise: 'Enterprise'
    },
    ar: {
      home: 'الرئيسية',
      aiInsights: 'رؤى الذكاء الاصطناعي',
      assets: 'الأصول',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      upgrade: 'ترقية الآن',
      freeTrial: 'تجربة مجانية',
      daysLeft: 'أيام متبقية',
      unlockFeatures: 'قم بالترقية لفتح جميع الميزات',
      companySettings: 'إعدادات الشركة',
      changePassword: 'تغيير كلمة المرور',
      notifications: 'الإشعارات',
      darkMode: 'الوضع الداكن',
      language: 'اللغة',
      subscription: 'الاشتراك',
      preferences: 'التفضيلات',
      welcome: 'مرحبا بعودتك',
      dashboardOverview: 'نظرة عامة على لوحة القيادة',
      activeAssets: 'الأصول النشطة',
      completedInspections: 'الفحوصات المكتملة',
      pendingReports: 'التقارير المعلقة',
      complianceRate: 'معدل الامتثال',
      recentActivity: 'النشاط الأخير',
      aiPredictions: 'توقعات الذكاء الاصطناعي',
      smartRecommendations: 'توصيات ذكية',
      riskAnalysis: 'تحليل المخاطر',
      generateReport: 'إنشاء تقرير',
      scanAsset: 'مسح الأصول',
      viewAll: 'عرض الكل',
      monthly: 'شهريا',
      yearly: 'سنويا',
      save: 'حفظ',
      selectPlan: 'اختر الخطة',
      currentPlan: 'الخطة الحالية',
      basic: 'أساسي',
      professional: 'احترافي',
      enterprise: 'مؤسسي'
    }
  };

  const t = translations[language] || translations.en;

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const plans = {
    basic: {
      name: t.basic,
      monthly: 99,
      yearly: 990,
      features: ['Up to 100 assets', 'Basic reporting', 'Email support', '5 team members']
    },
    professional: {
      name: t.professional,
      monthly: 299,
      yearly: 2990,
      features: ['Unlimited assets', 'Advanced AI insights', 'Priority support', 'Unlimited team members', 'API access']
    },
    enterprise: {
      name: t.enterprise,
      monthly: 300,
      yearly: 4000,
      features: ['Everything in Professional', 'Custom AI models', 'Dedicated support', 'White-label solution', 'Advanced security', 'Custom integrations']
    }
  };

  // Simulated AI Insights
  useEffect(() => {
    setAiInsights([
      {
        id: 1,
        type: 'prediction',
        title: 'Asset Maintenance Alert',
        description: 'Equipment A-247 likely needs maintenance in 7 days based on usage patterns',
        priority: 'high',
        confidence: 94
      },
      {
        id: 2,
        type: 'recommendation',
        title: 'Cost Optimization',
        description: 'Consolidating inspections on Tuesday could save 23% in operational costs',
        priority: 'medium',
        confidence: 87
      },
      {
        id: 3,
        type: 'risk',
        title: 'Compliance Risk Detected',
        description: '3 assets approaching certification expiry. Schedule renewals to avoid downtime',
        priority: 'high',
        confidence: 96
      },
      {
        id: 4,
        type: 'insight',
        title: 'Performance Trend',
        description: 'Asset utilization increased 18% this month. Consider expanding capacity',
        priority: 'low',
        confidence: 82
      }
    ]);
  }, []);

  // Home Screen Component
  const HomeScreen = () => (
    <div className="screen-content">
      <div className="home-header">
        <div>
          <h1 className="welcome-title">{t.welcome}</h1>
          <p className="welcome-subtitle">{t.dashboardOverview}</p>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          <button className="icon-button">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t.activeAssets}</p>
            <h3 className="stat-value">247</h3>
            <span className="stat-change positive">+12%</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t.completedInspections}</p>
            <h3 className="stat-value">1,429</h3>
            <span className="stat-change positive">+8%</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t.pendingReports}</p>
            <h3 className="stat-value">23</h3>
            <span className="stat-change negative">-5%</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t.complianceRate}</p>
            <h3 className="stat-value">98.5%</h3>
            <span className="stat-change positive">+2.3%</span>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h3>{t.aiPredictions}</h3>
          <button className="text-button">{t.viewAll}</button>
        </div>
        <div className="predictions-list">
          {aiInsights.slice(0, 2).map(insight => (
            <div key={insight.id} className="prediction-item">
              <div className={`prediction-icon ${insight.priority}`}>
                <Brain size={20} />
              </div>
              <div className="prediction-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
                <div className="prediction-meta">
                  <span className="confidence">{insight.confidence}% confidence</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h3>{t.recentActivity}</h3>
          <button className="text-button">{t.viewAll}</button>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <CheckCircle size={16} />
            </div>
            <div className="activity-content">
              <p><strong>Inspection completed</strong> - Building A-12</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon warning">
              <AlertCircle size={16} />
            </div>
            <div className="activity-content">
              <p><strong>Maintenance scheduled</strong> - Equipment B-45</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info">
              <FileText size={16} />
            </div>
            <div className="activity-content">
              <p><strong>Report generated</strong> - Monthly compliance</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-button">
          <Camera size={20} />
          {t.scanAsset}
        </button>
        <button className="secondary-button">
          <FileText size={20} />
          {t.generateReport}
        </button>
      </div>
    </div>
  );

  // AI Insights Screen Component
  const AIInsightsScreen = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h1>{t.aiInsights}</h1>
        <div className="header-actions">
          <button className="icon-button">
            <Filter size={20} />
          </button>
          <button className="icon-button">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="ai-features-grid">
        <div className="ai-feature-card">
          <div className="ai-feature-icon">
            <Brain size={32} />
          </div>
          <h3>{t.aiPredictions}</h3>
          <p>Predictive maintenance and failure prevention</p>
        </div>
        <div className="ai-feature-card">
          <div className="ai-feature-icon">
            <Sparkles size={32} />
          </div>
          <h3>{t.smartRecommendations}</h3>
          <p>AI-powered optimization suggestions</p>
        </div>
        <div className="ai-feature-card">
          <div className="ai-feature-icon">
            <TrendingUp size={32} />
          </div>
          <h3>{t.riskAnalysis}</h3>
          <p>Real-time risk assessment and mitigation</p>
        </div>
      </div>

      <div className="insights-list">
        {aiInsights.map(insight => (
          <div key={insight.id} className={`insight-card priority-${insight.priority}`}>
            <div className="insight-header">
              <div className="insight-badge">
                {insight.type === 'prediction' && <Brain size={18} />}
                {insight.type === 'recommendation' && <Sparkles size={18} />}
                {insight.type === 'risk' && <AlertCircle size={18} />}
                {insight.type === 'insight' && <TrendingUp size={18} />}
                <span>{insight.type}</span>
              </div>
              <span className={`priority-badge ${insight.priority}`}>
                {insight.priority}
              </span>
            </div>
            <h3>{insight.title}</h3>
            <p>{insight.description}</p>
            <div className="insight-footer">
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: `${insight.confidence}%` }}></div>
              </div>
              <span className="confidence-text">{insight.confidence}% confidence</span>
            </div>
            <button className="insight-action">View Details</button>
          </div>
        ))}
      </div>

      <div className="ai-analytics">
        <h3>AI Performance Metrics</h3>
        <div className="metrics-grid">
          <div className="metric">
            <Activity size={24} />
            <div>
              <p className="metric-value">94.7%</p>
              <p className="metric-label">Prediction Accuracy</p>
            </div>
          </div>
          <div className="metric">
            <Zap size={24} />
            <div>
              <p className="metric-value">1,247</p>
              <p className="metric-label">Insights Generated</p>
            </div>
          </div>
          <div className="metric">
            <DollarSign size={24} />
            <div>
              <p className="metric-value">$124K</p>
              <p className="metric-label">Cost Savings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Assets Screen Component
  const AssetsScreen = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h1>{t.assets}</h1>
        <div className="header-actions">
          <button className="icon-button">
            <Search size={20} />
          </button>
          <button className="icon-button">
            <Filter size={20} />
          </button>
          <button className="icon-button primary">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Search assets..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-chips">
        <button className="chip active">All</button>
        <button className="chip">Active</button>
        <button className="chip">Maintenance</button>
        <button className="chip">Inactive</button>
      </div>

      <div className="assets-list">
        {[
          { id: 'A-247', name: 'HVAC System', status: 'active', health: 94, location: 'Building A' },
          { id: 'B-143', name: 'Elevator Unit', status: 'maintenance', health: 67, location: 'Building B' },
          { id: 'C-892', name: 'Fire System', status: 'active', health: 98, location: 'Building C' },
          { id: 'D-456', name: 'Generator', status: 'active', health: 89, location: 'Building D' },
          { id: 'E-721', name: 'Water Pump', status: 'maintenance', health: 72, location: 'Building E' }
        ].map(asset => (
          <div key={asset.id} className="asset-card">
            <div className="asset-header">
              <div>
                <h3>{asset.name}</h3>
                <p className="asset-id">{asset.id} • {asset.location}</p>
              </div>
              <span className={`status-badge ${asset.status}`}>{asset.status}</span>
            </div>
            <div className="asset-health">
              <div className="health-bar">
                <div 
                  className="health-fill" 
                  style={{ 
                    width: `${asset.health}%`,
                    backgroundColor: asset.health > 80 ? '#10b981' : asset.health > 60 ? '#f59e0b' : '#ef4444'
                  }}
                ></div>
              </div>
              <span className="health-value">{asset.health}%</span>
            </div>
            <div className="asset-actions">
              <button className="asset-action-btn">
                <Eye size={16} />
                View
              </button>
              <button className="asset-action-btn">
                <FileText size={16} />
                Report
              </button>
              <button className="asset-action-btn">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Profile Screen Component
  const ProfileScreen = () => (
    <div className="screen-content">
      <div className="screen-header">
        <h1>{t.profile}</h1>
        <button className="icon-button">
          <Settings size={20} />
        </button>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          <User size={48} />
        </div>
        <div className="profile-info">
          <h2>John Anderson</h2>
          <p>john.anderson@fieldcheck.com</p>
          <span className="role-badge">Administrator</span>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-item" onClick={() => {}}>
          <div className="settings-item-left">
            <div className="settings-icon">
              <Home size={20} />
            </div>
            <span>{t.companySettings}</span>
          </div>
          <ChevronRight size={20} />
        </div>

        <div className="settings-item" onClick={() => {}}>
          <div className="settings-item-left">
            <div className="settings-icon">
              <Lock size={20} />
            </div>
            <span>{t.changePassword}</span>
          </div>
          <ChevronRight size={20} />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">{t.preferences}</h3>
        
        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-icon">
              <Bell size={20} />
            </div>
            <span>{t.notifications}</span>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-icon">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span>{t.darkMode}</span>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item" onClick={() => setShowLanguageModal(true)}>
          <div className="settings-item-left">
            <div className="settings-icon">
              <Globe size={20} />
            </div>
            <span>{t.language}</span>
          </div>
          <div className="settings-item-right">
            <span className="current-value">
              {languages.find(l => l.code === language)?.name}
            </span>
            <ChevronRight size={20} />
          </div>
        </div>
      </div>

      <div className="subscription-section">
        <h3 className="section-title">{t.subscription}</h3>
        <div className="subscription-card">
          <div className="subscription-header">
            <Award size={24} />
            <div>
              <h4>{t.freeTrial}</h4>
              <p className="trial-days">3 {t.daysLeft}</p>
            </div>
          </div>
          <p className="subscription-text">{t.unlockFeatures}</p>
          <button 
            className="upgrade-button"
            onClick={() => setShowUpgradeModal(true)}
          >
            {t.upgrade}
          </button>
        </div>
      </div>

      <button className="logout-button">
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );

  // Language Modal
  const LanguageModal = () => (
    <div className="modal-overlay" onClick={() => setShowLanguageModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.language}</h2>
          <button className="icon-button" onClick={() => setShowLanguageModal(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="language-list">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-item ${language === lang.code ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.code);
                setShowLanguageModal(false);
              }}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {language === lang.code && <CheckCircle size={20} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Upgrade Modal
  const UpgradeModal = () => (
    <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
      <div className="modal-content upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.selectPlan}</h2>
          <button className="icon-button" onClick={() => setShowUpgradeModal(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="billing-toggle">
          <button 
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            {t.monthly}
          </button>
          <button 
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            {t.yearly}
            <span className="save-badge">{t.save} 17%</span>
          </button>
        </div>

        <div className="plans-grid">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key}
              className={`plan-card ${selectedPlan === key ? 'selected' : ''} ${key === 'enterprise' ? 'featured' : ''}`}
            >
              {key === 'enterprise' && <div className="featured-badge">Popular</div>}
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">{billingCycle === 'monthly' ? plan.monthly : plan.yearly}</span>
                <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`plan-button ${selectedPlan === key ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(key)}
              >
                {selectedPlan === key ? t.currentPlan : t.selectPlan}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="bottom-nav">
      <button 
        className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('home')}
      >
        <Home size={24} />
        <span>{t.home}</span>
      </button>
      <button 
        className={`nav-item ${currentScreen === 'ai' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('ai')}
      >
        <Sparkles size={24} />
        <span>{t.aiInsights}</span>
      </button>
      <button 
        className={`nav-item ${currentScreen === 'assets' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('assets')}
      >
        <BarChart3 size={24} />
        <span>{t.assets}</span>
      </button>
      <button 
        className={`nav-item ${currentScreen === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('profile')}
      >
        <User size={24} />
        <span>{t.profile}</span>
      </button>
    </div>
  );

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'ai' && <AIInsightsScreen />}
      {currentScreen === 'assets' && <AssetsScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      
      <BottomNav />
      
      {showLanguageModal && <LanguageModal />}
      {showUpgradeModal && <UpgradeModal />}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .app-container {
          width: 100%;
          max-width: 428px;
          height: 100vh;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .app-container.dark-mode {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .screen-content {
          height: calc(100vh - 80px);
          overflow-y: auto;
          padding: 20px;
          padding-bottom: 100px;
          background: #f8fafc;
        }

        .app-container.dark-mode .screen-content {
          background: #0f172a;
          color: #e2e8f0;
        }

        /* Header Styles */
        .home-header, .screen-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .app-container.dark-mode .welcome-title,
        .app-container.dark-mode h1,
        .app-container.dark-mode h2,
        .app-container.dark-mode h3 {
          color: #f1f5f9;
        }

        .welcome-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .icon-button {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .app-container.dark-mode .icon-button {
          background: #1e293b;
          color: #e2e8f0;
        }

        .icon-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .icon-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .stat-card {
          background: #1e293b;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .stat-card.primary .stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-card.success .stat-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .stat-card.warning .stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .stat-card.info .stat-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .app-container.dark-mode .stat-value {
          color: #f1f5f9;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          display: inline-block;
        }

        .stat-change.positive {
          background: #d1fae5;
          color: #059669;
        }

        .stat-change.negative {
          background: #fee2e2;
          color: #dc2626;
        }

        /* Section Card */
        .section-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .section-card {
          background: #1e293b;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .text-button {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Predictions */
        .predictions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .prediction-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .prediction-item {
          background: #0f172a;
        }

        .prediction-item:hover {
          transform: translateX(4px);
        }

        .prediction-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .prediction-icon.high {
          background: #fee2e2;
          color: #dc2626;
        }

        .prediction-icon.medium {
          background: #fef3c7;
          color: #d97706;
        }

        .prediction-icon.low {
          background: #dbeafe;
          color: #2563eb;
        }

        .prediction-content {
          flex: 1;
        }

        .prediction-content h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .app-container.dark-mode .prediction-content h4 {
          color: #f1f5f9;
        }

        .prediction-content p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .prediction-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #667eea;
          font-size: 12px;
          font-weight: 600;
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-icon.success {
          background: #d1fae5;
          color: #059669;
        }

        .activity-icon.warning {
          background: #fef3c7;
          color: #d97706;
        }

        .activity-icon.info {
          background: #dbeafe;
          color: #2563eb;
        }

        .activity-content p {
          font-size: 14px;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .app-container.dark-mode .activity-content p {
          color: #e2e8f0;
        }

        .activity-time {
          font-size: 12px;
          color: #64748b;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .primary-button {
          flex: 1;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .secondary-button {
          flex: 1;
          padding: 16px;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .secondary-button {
          background: #1e293b;
          color: #e2e8f0;
          border-color: #475569;
        }

        .secondary-button:hover {
          background: #667eea;
          color: white;
        }

        /* AI Insights Screen */
        .ai-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .ai-feature-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .ai-feature-card {
          background: #1e293b;
        }

        .ai-feature-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-feature-card h3 {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .ai-feature-card p {
          font-size: 11px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Insights List */
        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .insight-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-left: 4px solid transparent;
        }

        .app-container.dark-mode .insight-card {
          background: #1e293b;
        }

        .insight-card.priority-high {
          border-left-color: #ef4444;
        }

        .insight-card.priority-medium {
          border-left-color: #f59e0b;
        }

        .insight-card.priority-low {
          border-left-color: #3b82f6;
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .insight-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f1f5f9;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #667eea;
          text-transform: capitalize;
        }

        .app-container.dark-mode .insight-badge {
          background: #0f172a;
        }

        .priority-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: #fee2e2;
          color: #dc2626;
        }

        .priority-badge.medium {
          background: #fef3c7;
          color: #d97706;
        }

        .priority-badge.low {
          background: #dbeafe;
          color: #2563eb;
        }

        .insight-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .insight-card p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .insight-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .confidence-bar {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .app-container.dark-mode .confidence-bar {
          background: #334155;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .confidence-text {
          font-size: 12px;
          font-weight: 600;
          color: #667eea;
        }

        .insight-action {
          width: 100%;
          padding: 12px;
          background: #f8fafc;
          color: #667eea;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .insight-action {
          background: #0f172a;
        }

        .insight-action:hover {
          background: #667eea;
          color: white;
        }

        /* AI Analytics */
        .ai-analytics {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-top: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .ai-analytics {
          background: #1e293b;
        }

        .ai-analytics h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .metrics-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .app-container.dark-mode .metric {
          background: #0f172a;
        }

        .metric svg {
          width: 40px;
          height: 40px;
          color: #667eea;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .app-container.dark-mode .metric-value {
          color: #f1f5f9;
        }

        .metric-label {
          font-size: 13px;
          color: #64748b;
        }

        /* Assets Screen */
        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .search-bar {
          background: #1e293b;
        }

        .search-bar input {
          flex: 1;
          border: none;
          background: none;
          font-size: 15px;
          color: #1e293b;
          outline: none;
        }

        .app-container.dark-mode .search-bar input {
          color: #e2e8f0;
        }

        .search-bar input::placeholder {
          color: #94a3b8;
        }

        .filter-chips {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .chip {
          padding: 8px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .chip {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }

        .chip.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        /* Assets List */
        .assets-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .asset-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .asset-card {
          background: #1e293b;
        }

        .asset-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .asset-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .asset-id {
          font-size: 13px;
          color: #64748b;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #059669;
        }

        .status-badge.maintenance {
          background: #fef3c7;
          color: #d97706;
        }

        .status-badge.inactive {
          background: #f1f5f9;
          color: #64748b;
        }

        .asset-health {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .health-bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .app-container.dark-mode .health-bar {
          background: #334155;
        }

        .health-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .health-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .app-container.dark-mode .health-value {
          color: #f1f5f9;
        }

        .asset-actions {
          display: flex;
          gap: 8px;
        }

        .asset-action-btn {
          flex: 1;
          padding: 10px;
          background: #f8fafc;
          color: #667eea;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .asset-action-btn {
          background: #0f172a;
        }

        .asset-action-btn:hover {
          background: #667eea;
          color: white;
        }

        /* Profile Screen */
        .profile-header {
          text-align: center;
          padding: 32px 0;
          background: white;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .profile-header {
          background: #1e293b;
        }

        .profile-avatar {
          width: 96px;
          height: 96px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-info h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .profile-info p {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 12px;
        }

        .role-badge {
          display: inline-block;
          padding: 6px 16px;
          background: #ede9fe;
          color: #7c3aed;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        /* Settings Section */
        .settings-section {
          background: white;
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .settings-section {
          background: #1e293b;
        }

        .section-title {
          padding: 16px 20px 8px;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .settings-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .app-container.dark-mode .settings-item {
          border-bottom-color: #334155;
        }

        .settings-item:last-child {
          border-bottom: none;
        }

        .settings-item:hover {
          background: #f8fafc;
        }

        .app-container.dark-mode .settings-item:hover {
          background: #0f172a;
        }

        .settings-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .settings-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f1f5f9;
          color: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app-container.dark-mode .settings-icon {
          background: #0f172a;
        }

        .settings-item span {
          font-size: 15px;
          font-weight: 500;
          color: #1e293b;
        }

        .app-container.dark-mode .settings-item span {
          color: #e2e8f0;
        }

        .settings-item-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current-value {
          font-size: 14px;
          color: #64748b;
        }

        /* Toggle Switch */
        .toggle {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: 0.4s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        .toggle input:checked + .toggle-slider {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        /* Subscription Section */
        .subscription-section {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .app-container.dark-mode .subscription-section {
          background: #1e293b;
        }

        .subscription-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
        }

        .subscription-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .subscription-header h4 {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .trial-days {
          font-size: 14px;
          opacity: 0.9;
        }

        .subscription-text {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .upgrade-button {
          width: 100%;
          padding: 14px;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        /* Logout Button */
        .logout-button {
          width: 100%;
          padding: 16px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .logout-button {
          background: #7f1d1d;
          color: #fca5a5;
        }

        .logout-button:hover {
          background: #dc2626;
          color: white;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: flex-end;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          width: 100%;
          max-width: 428px;
          max-height: 90vh;
          background: white;
          border-radius: 24px 24px 0 0;
          padding: 24px;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .app-container.dark-mode .modal-content {
          background: #1e293b;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
        }

        /* Language List */
        .language-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .language-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .app-container.dark-mode .language-item {
          background: #0f172a;
        }

        .language-item.active {
          background: #ede9fe;
          border-color: #667eea;
        }

        .app-container.dark-mode .language-item.active {
          background: #312e81;
        }

        .language-item:hover {
          transform: translateX(4px);
        }

        .language-flag {
          font-size: 28px;
        }

        .language-name {
          flex: 1;
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
        }

        .app-container.dark-mode .language-name {
          color: #e2e8f0;
        }

        .language-item svg {
          color: #667eea;
        }

        /* Upgrade Modal */
        .upgrade-modal {
          max-height: 95vh;
        }

        .billing-toggle {
          display: flex;
          gap: 8px;
          padding: 4px;
          background: #f1f5f9;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .app-container.dark-mode .billing-toggle {
          background: #0f172a;
        }

        .billing-toggle button {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .billing-toggle button.active {
          background: white;
          color: #667eea;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .app-container.dark-mode .billing-toggle button.active {
          background: #1e293b;
        }

        .save-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          padding: 2px 6px;
          background: #10b981;
          color: white;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
        }

        /* Plans Grid */
        .plans-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 24px;
        }

        .plan-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .plan-card {
          background: #0f172a;
          border-color: #334155;
        }

        .plan-card.selected {
          border-color: #667eea;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }

        .plan-card.featured {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        }

        .featured-badge {
          position: absolute;
          top: -12px;
          right: 24px;
          padding: 6px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .plan-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          margin-bottom: 24px;
        }

        .currency {
          font-size: 20px;
          font-weight: 600;
          color: #64748b;
        }

        .amount {
          font-size: 48px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
          margin: 0 4px;
        }

        .app-container.dark-mode .amount {
          color: #f1f5f9;
        }

        .period {
          font-size: 16px;
          font-weight: 500;
          color: #64748b;
        }

        .plan-features {
          list-style: none;
          margin-bottom: 24px;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #475569;
        }

        .app-container.dark-mode .plan-features li {
          border-bottom-color: #334155;
          color: #cbd5e1;
        }

        .plan-features li:last-child {
          border-bottom: none;
        }

        .plan-features svg {
          color: #10b981;
          min-width: 16px;
        }

        .plan-button {
          width: 100%;
          padding: 14px;
          background: #f1f5f9;
          color: #667eea;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .app-container.dark-mode .plan-button {
          background: #334155;
        }

        .plan-button:hover {
          background: #667eea;
          color: white;
        }

        .plan-button.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        /* Bottom Navigation */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 428px;
          height: 80px;
          background: white;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 16px;
          z-index: 100;
        }

        .app-container.dark-mode .bottom-nav {
          background: #1e293b;
          border-top-color: #334155;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 12px;
        }

        .nav-item:hover {
          background: #f8fafc;
        }

        .app-container.dark-mode .nav-item:hover {
          background: #0f172a;
        }

        .nav-item.active {
          color: #667eea;
          background: #ede9fe;
        }

        .app-container.dark-mode .nav-item.active {
          background: #312e81;
        }

        .nav-item span {
          font-size: 11px;
          font-weight: 600;
        }

        /* Scrollbar Styles */
        .screen-content::-webkit-scrollbar {
          width: 6px;
        }

        .screen-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .screen-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .app-container.dark-mode .screen-content::-webkit-scrollbar-thumb {
          background: #475569;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default FieldCheckApp;