import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import colors from '../../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        companyName: formData.companyName.trim(),
        industry: formData.industry.trim() || null,
        phone: formData.phone.trim() || null,
      });

      if (!result.success) {
        Alert.alert('Registration Failed', result.message || 'Unable to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Input
          label="First Name"
          value={formData.firstName}
          onChangeText={(text) => updateField('firstName', text)}
          placeholder="Enter your first name"
          leftIcon="person-outline"
          error={errors.firstName}
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChangeText={(text) => updateField('lastName', text)}
          placeholder="Enter your last name"
          leftIcon="person-outline"
          error={errors.lastName}
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
          error={errors.email}
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text) => updateField('password', text)}
          placeholder="Create a password"
          secureTextEntry
          leftIcon="lock-closed-outline"
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => updateField('confirmPassword', text)}
          placeholder="Confirm your password"
          secureTextEntry
          leftIcon="lock-closed-outline"
          error={errors.confirmPassword}
        />

        <Text style={styles.sectionTitle}>Company Information</Text>

        <Input
          label="Company Name"
          value={formData.companyName}
          onChangeText={(text) => updateField('companyName', text)}
          placeholder="Enter company name"
          leftIcon="business-outline"
          error={errors.companyName}
        />

        <Input
          label="Industry (Optional)"
          value={formData.industry}
          onChangeText={(text) => updateField('industry', text)}
          placeholder="e.g., Construction, Manufacturing"
          leftIcon="briefcase-outline"
        />

        <Input
          label="Phone (Optional)"
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          placeholder="Enter company phone"
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />

        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          style={styles.registerButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            title="Sign In"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 24,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
});

export default RegisterScreen;