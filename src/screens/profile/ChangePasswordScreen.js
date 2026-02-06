// ChangePasswordScreen.js
// Location: src/screens/Profile/ChangePasswordScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../utils/i18n';

export default function ChangePasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Show/hide password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '#EF4444'
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (newPassword) {
      calculatePasswordStrength(newPassword);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '#EF4444' });
    }
  }, [newPassword]);

  const loadPreferences = async () => {
    try {
      const language = await AsyncStorage.getItem('language');
      const darkMode = await AsyncStorage.getItem('darkMode');
      if (language) setCurrentLanguage(language);
      if (darkMode) setIsDarkMode(darkMode === 'true');
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score++;  // lowercase
    if (/[A-Z]/.test(password)) score++;  // uppercase
    if (/[0-9]/.test(password)) score++;  // numbers
    if (/[^A-Za-z0-9]/.test(password)) score++;  // special characters
    
    // Map score to strength
    let strength;
    if (score <= 2) {
      strength = { score, label: 'Weak', color: '#EF4444' };
    } else if (score <= 4) {
      strength = { score, label: 'Medium', color: '#F59E0B' };
    } else {
      strength = { score, label: 'Strong', color: '#10B981' };
    }
    
    setPasswordStrength(strength);
  };

  const validatePassword = () => {
    // Check if current password is provided
    if (!currentPassword.trim()) {
      Alert.alert('Validation Error', 'Please enter your current password');
      return false;
    }

    // Check if new password is provided
    if (!newPassword.trim()) {
      Alert.alert('Validation Error', 'Please enter a new password');
      return false;
    }

    // Check password length
    if (newPassword.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters long');
      return false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match');
      return false;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      Alert.alert('Validation Error', 'New password must be different from current password');
      return false;
    }

    // Check password strength
    if (passwordStrength.score < 3) {
      Alert.alert(
        'Weak Password',
        'Your password is weak. Consider using a stronger password with:\n\n• At least 8 characters\n• Uppercase and lowercase letters\n• Numbers\n• Special characters',
        [
          { text: 'Use Anyway', style: 'destructive', onPress: () => handleChangePassword() },
          { text: 'Change Password', style: 'cancel' }
        ]
      );
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      // In a real app, you would verify the current password and update it via API
      // For now, we'll simulate this with AsyncStorage
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, you would do:
      // const response = await fetch('YOUR_API_URL/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword,
      //     newPassword
      //   })
      // });
      
      // For demo, save to AsyncStorage (NOT secure for production!)
      await AsyncStorage.setItem('userPassword', newPassword);

      Alert.alert(
        'Success',
        'Your password has been changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear fields
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              // Go back
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const colors = isDarkMode ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    primary: '#10B981',
    inputBg: '#2A2A2A',
    inputBorder: '#404040'
  } : {
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    primary: '#10B981',
    inputBg: '#FFFFFF',
    inputBorder: '#E5E7EB'
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Security Info */}
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Choose a strong password to keep your account secure. We recommend using at least 8 characters with a mix of letters, numbers, and symbols.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Current Password *
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Ionicons 
                    name={showCurrentPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                New Password *
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons 
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3, 4, 5, 6].map((bar) => (
                      <View
                        key={bar}
                        style={[
                          styles.strengthBar,
                          { backgroundColor: bar <= passwordStrength.score ? passwordStrength.color : '#E5E7EB' }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Confirm New Password *
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchIndicator}>
                  {newPassword === confirmPassword ? (
                    <>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={[styles.matchText, { color: '#10B981' }]}>
                        Passwords match
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="close-circle" size={16} color="#EF4444" />
                      <Text style={[styles.matchText, { color: '#EF4444' }]}>
                        Passwords do not match
                      </Text>
                    </>
                  )}
                </View>
              )}
            </View>

            {/* Password Requirements */}
            <View style={[styles.requirementsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.requirementsTitle, { color: colors.text }]}>
                Password Requirements:
              </Text>
              <View style={styles.requirement}>
                <Ionicons 
                  name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={newPassword.length >= 8 ? '#10B981' : colors.textSecondary} 
                />
                <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons 
                  name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[A-Z]/.test(newPassword) ? '#10B981' : colors.textSecondary} 
                />
                <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                  One uppercase letter
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons 
                  name={/[a-z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[a-z]/.test(newPassword) ? '#10B981' : colors.textSecondary} 
                />
                <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                  One lowercase letter
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons 
                  name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[0-9]/.test(newPassword) ? '#10B981' : colors.textSecondary} 
                />
                <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                  One number
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons 
                  name={/[^A-Za-z0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[^A-Za-z0-9]/.test(newPassword) ? '#10B981' : colors.textSecondary} 
                />
                <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
                  One special character (!@#$%^&*)
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Change Password Button - Fixed at bottom */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.changeButton, loading && styles.changeButtonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#10B981', '#059669']}
              style={styles.changeButtonGradient}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.changeButtonText}>Changing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="key" size={24} color="#FFFFFF" />
                  <Text style={styles.changeButtonText}>Change Password</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirementsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  changeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  changeButtonDisabled: {
    opacity: 0.7,
  },
  changeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});