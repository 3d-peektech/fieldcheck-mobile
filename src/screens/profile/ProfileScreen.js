import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  Modal,
  I18nManager,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { t, tArray, availableLanguages } from '../../utils/i18n';

export default function ProfileScreen({ navigation }) {
  // Estado
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
  
  // Cargar preferencias guardadas
  useEffect(() => {
    loadPreferences();
  }, []);
  
  const loadPreferences = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      const notifications = await AsyncStorage.getItem('notifications');
      const language = await AsyncStorage.getItem('language');
      
      if (darkMode !== null) setIsDarkMode(darkMode === 'true');
      if (notifications !== null) setNotificationsEnabled(notifications === 'true');
      if (language !== null) setCurrentLanguage(language);
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };
  
  // Toggle Dark Mode
  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem('darkMode', String(newValue));
      Alert.alert(
        'Success',
        `Dark Mode ${newValue ? 'enabled' : 'disabled'}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save dark mode setting');
    }
  };
  
  // Toggle Notifications
  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    try {
      await AsyncStorage.setItem('notifications', String(newValue));
    } catch (error) {
      console.log('Error saving notifications:', error);
    }
  };
  
  // Cambiar idioma
  const changeLanguage = async (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageModal(false);
    
    try {
      await AsyncStorage.setItem('language', langCode);
      
      // Si es árabe, cambiar dirección RTL
      if (langCode === 'ar') {
        I18nManager.forceRTL(true);
      } else if (I18nManager.isRTL) {
        I18nManager.forceRTL(false);
      }
      
      Alert.alert(
        'Success',
        'Language changed successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reiniciar app si cambió RTL
              if (langCode === 'ar' || (currentLanguage === 'ar' && langCode !== 'ar')) {
                if (Platform.OS === 'android') {
                  Alert.alert(
                    'Restart Required',
                    'Please restart the app to apply language changes',
                    [{ text: 'OK' }]
                  );
                }
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save language setting');
    }
  };
  
  // Planes de suscripción
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      priceMonthly: 99,
      priceYearly: 990,
      description: 'Perfect for small teams',
      features: [
        'Up to 5 users',
        'Basic AI detection',
        '100 inspections/month',
        'Email support',
        'Mobile app access'
      ],
      stripeMonthly: 'https://buy.stripe.com/test_28o5kr1mw7HN0dq144',
      stripeYearly: 'https://buy.stripe.com/test_6oE4gn2qA8LRcW4001'
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 299,
      priceYearly: 2990,
      description: 'Most popular for growing businesses',
      popular: true,
      features: [
        'Up to 50 users',
        'Advanced AI analysis',
        'Unlimited inspections',
        'Priority support',
        'Custom reports',
        'API access'
      ],
      stripeMonthly: 'https://buy.stripe.com/test_3cs4gn3uE1jpdW8004',
      stripeYearly: 'https://buy.stripe.com/test_14k28f5CA4vB85y005'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 'Custom',
      priceYearly: 'Custom',
      description: 'Custom solutions for large organizations',
      features: [
        'Unlimited users',
        'Custom AI models',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
        'On-premise option'
      ],
      custom: true
    }
  ];
  
  // Manejar suscripción
  const handleSubscription = (plan, isTrial = false) => {
    if (plan.custom) {
      // Plan Enterprise - Contactar ventas
      Alert.alert(
        'Contact Sales',
        'Contact our sales team for custom enterprise pricing',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Email Sales', 
            onPress: () => Linking.openURL('mailto:3dpeektech@consultant.com?subject=Enterprise Plan Inquiry')
          }
        ]
      );
      return;
    }
    
    if (isTrial) {
      // Iniciar prueba gratuita
      Alert.alert(
        'Start Free Trial',
        `Start your 30-day free trial for ${plan.name}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Trial',
            onPress: () => {
              Alert.alert('Success', 'Free trial started successfully!');
              setShowSubscriptionModal(false);
            }
          }
        ]
      );
    } else {
      // Suscribirse - Redirigir a Stripe
      const stripeUrl = billingCycle === 'monthly' ? plan.stripeMonthly : plan.stripeYearly;
      
      Alert.alert(
        'Subscribe',
        `Subscribe to ${plan.name} (${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue',
            onPress: () => {
              Linking.openURL(stripeUrl).catch(() => {
                Alert.alert('Error', 'Failed to open browser');
              });
              setShowSubscriptionModal(false);
            }
          }
        ]
      );
    }
  };
  
  // Funciones de soporte
  const handleEmailSupport = () => {
    Linking.openURL('mailto:3dpeektech@consultant.com?subject=FieldCheck Support Request');
  };
  
  const handleCallSupport = () => {
    Alert.alert(
      'Call Support',
      '+31 639 34 99 63',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL('tel:+31639349963') }
      ]
    );
  };
  
  const handleOfficeLocation = () => {
    const address = 'Avenida Madrid, Cintruenigo, Navarra, Spain';
    Alert.alert(
      'Office Location',
      address,
      [
        { text: 'Close', style: 'cancel' },
        { 
          text: 'Open Maps', 
          onPress: () => {
            const url = Platform.select({
              ios: `maps://app?address=${encodeURIComponent(address)}`,
              android: `geo:0,0?q=${encodeURIComponent(address)}`
            });
            Linking.openURL(url);
          }
        }
      ]
    );
  };
  
  // Colores del tema
  const colors = isDarkMode ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    primary: '#10B981',
    danger: '#EF4444'
  } : {
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    primary: '#10B981',
    danger: '#EF4444'
  };
  
  // Componente de item de menú
  const MenuItem = ({ icon, title, subtitle, onPress, rightElement, showChevron = true }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {rightElement}
        {showChevron && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección de Preferencias */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            PREFERENCES
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              onPress={toggleNotifications}
              showChevron={false}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            
            <MenuItem
              icon="moon-outline"
              title="Dark Mode"
              onPress={toggleDarkMode}
              showChevron={false}
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            
            <MenuItem
              icon="language-outline"
              title="Language"
              subtitle={availableLanguages?.find(l => l.code === currentLanguage)?.name || 'English'}
              onPress={() => setShowLanguageModal(true)}
            />
          </View>
        </View>
        
        {/* Sección de Suscripción */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            SUBSCRIPTION
          </Text>
          
          <TouchableOpacity 
            style={[styles.subscriptionCard, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={() => setShowSubscriptionModal(true)}
            activeOpacity={0.9}
          >
            <View style={styles.subscriptionHeader}>
              <View>
                <Text style={[styles.subscriptionLabel, { color: colors.textSecondary }]}>
                  Current Plan
                </Text>
                <Text style={[styles.subscriptionPlan, { color: colors.text }]}>
                  Free Trial
                </Text>
              </View>
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>3 days left</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setShowSubscriptionModal(true)}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeButtonGradient}
              >
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        
        {/* Sección de Soporte */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            SUPPORT
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <MenuItem
              icon="mail-outline"
              title="Email Support"
              subtitle="3dpeektech@consultant.com"
              onPress={handleEmailSupport}
            />
            
            <MenuItem
              icon="call-outline"
              title="Call Support"
              subtitle="+31 639 34 99 63"
              onPress={handleCallSupport}
            />
            
            <MenuItem
              icon="location-outline"
              title="Office Location"
              subtitle="Cintruenigo, Navarra, Spain"
              onPress={handleOfficeLocation}
            />
          </View>
        </View>
        
        {/* Sección de Cuenta */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ACCOUNT
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              onPress={() => Alert.alert('Coming Soon')}
            />
            
            <MenuItem
              icon="key-outline"
              title="Change Password"
              onPress={() => Alert.alert('Coming Soon')}
            />
            
            <MenuItem
              icon="download-outline"
              title="Export My Data"
              onPress={() => Alert.alert('Coming Soon')}
            />
          </View>
        </View>
        
        {/* Sección de Acerca de */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ABOUT
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <MenuItem
              icon="help-circle-outline"
              title="Help Center"
              onPress={() => navigation.navigate('HelpCenter')}
            />
            
            <MenuItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => navigation.navigate('TermsAndPrivacy', { tab: 'terms' })}
            />
            
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => navigation.navigate('TermsAndPrivacy', { tab: 'privacy' })}
            />
            
            <MenuItem
              icon="information-circle-outline"
              title="About FieldCheck"
              subtitle="Version 1.0.0"
              onPress={() => Alert.alert('FieldCheck', 'Version 1.0.0\n© 2026 3DPeek Tech')}
              showChevron={false}
            />
          </View>
        </View>
        
        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity 
          style={[styles.logoutButton, { borderColor: colors.danger }]}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => {
                  Alert.alert('Success', 'Logged out successfully');
                }}
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Modal de Idiomas */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Language
              </Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {availableLanguages && availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  { borderBottomColor: colors.border },
                  currentLanguage === lang.code && { backgroundColor: `${colors.primary}15` }
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[styles.languageName, { color: colors.text }]}>{lang.name}</Text>
                {currentLanguage === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Modal de Suscripciones */}
      <Modal
        visible={showSubscriptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSubscriptionModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSubscriptionModal(false)}
        >
          <ScrollView 
            style={styles.subscriptionModalContent}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={[styles.subscriptionModal, { backgroundColor: colors.card }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Choose Your Plan
                  </Text>
                  <TouchableOpacity onPress={() => setShowSubscriptionModal(false)}>
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
                
                {/* Selector de ciclo de facturación */}
                <View style={styles.billingToggle}>
                  <TouchableOpacity
                    style={[
                      styles.billingOption,
                      billingCycle === 'monthly' && styles.billingOptionActive
                    ]}
                    onPress={() => setBillingCycle('monthly')}
                  >
                    <Text style={[
                      styles.billingOptionText,
                      billingCycle === 'monthly' && styles.billingOptionTextActive
                    ]}>
                      Monthly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.billingOption,
                      billingCycle === 'yearly' && styles.billingOptionActive
                    ]}
                    onPress={() => setBillingCycle('yearly')}
                  >
                    <Text style={[
                      styles.billingOptionText,
                      billingCycle === 'yearly' && styles.billingOptionTextActive
                    ]}>
                      Yearly
                    </Text>
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveBadgeText}>-20%</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Planes */}
                {subscriptionPlans && subscriptionPlans.map((plan) => (
                  <View 
                    key={plan.id}
                    style={[
                      styles.planCard,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      plan.popular && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                  >
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>POPULAR</Text>
                      </View>
                    )}
                    
                    <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                    <View style={styles.planPriceRow}>
                      <Text style={[styles.planPrice, { color: colors.text }]}>
                        {plan.custom ? 'Custom' : `€${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}`}
                      </Text>
                      {!plan.custom && (
                        <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>
                          / {billingCycle === 'monthly' ? 'month' : 'year'}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.planDescription, { color: colors.textSecondary }]}>
                      {plan.description}
                    </Text>
                    
                    <View style={styles.planFeatures}>
                      {plan.features && plan.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                          <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                    
                    <View style={styles.planButtons}>
                      <TouchableOpacity
                        style={[styles.planButton, styles.planButtonOutline, { borderColor: colors.primary }]}
                        onPress={() => handleSubscription(plan, true)}
                      >
                        <Text style={[styles.planButtonText, { color: colors.primary }]}>
                          Start Free Trial
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.planButton, { backgroundColor: colors.primary }]}
                        onPress={() => handleSubscription(plan, false)}
                      >
                        <Text style={[styles.planButtonText, { color: '#FFFFFF' }]}>
                          {plan.custom ? 'Contact Sales' : 'Subscribe'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscriptionCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  subscriptionPlan: {
    fontSize: 20,
    fontWeight: '700',
  },
  trialBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trialBadgeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  upgradeButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    flex: 1,
  },
  subscriptionModalContent: {
    flex: 1,
  },
  subscriptionModal: {
    margin: 20,
    borderRadius: 20,
    marginTop: 60,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    margin: 20,
    marginTop: 0,
  },
  billingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  billingOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billingOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  billingOptionTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  saveBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  saveBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  planCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  planName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
  },
  planPeriod: {
    fontSize: 16,
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  planFeatures: {
    marginBottom: 20,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  planButtons: {
    gap: 12,
  },
  planButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  planButtonOutline: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});