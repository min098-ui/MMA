import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

export default function LoginScreen({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation regex
  const isValidEmail = (str) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  const validate = (currentEmail, currentPassword) => {
    const errs = {};

    if (!currentEmail || currentEmail.trim() === '') {
      errs.email = 'Email is required';
    } else if (!isValidEmail(currentEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!currentPassword) {
      errs.password = 'Password is required';
    }

    return errs;
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (hasSubmitted) {
      const newErrors = { ...errors };
      if (!val || val.trim() === '') {
        newErrors.email = 'Email is required';
      } else if (!isValidEmail(val)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
      setErrors(newErrors);
    }
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (hasSubmitted) {
      const newErrors = { ...errors };
      if (!val) {
        newErrors.password = 'Password is required';
      } else {
        delete newErrors.password;
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setAuthError('');

    const validationErrors = validate(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation to List screen is handled automatically via Auth state
    } catch (err) {
      // Show exact Firebase error message in error-auth
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.headerArea}>
          <View style={styles.cloudBadge}>
            <Text style={styles.cloudBadgeText}>☁️  LÀNG MÂY BOOKSHELF</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your BookShelf account</Text>
        </View>

        {authError ? (
          <View style={styles.errorBox}>
            <Text testID="error-auth" style={styles.authErrorText}>
              {authError}
            </Text>
          </View>
        ) : null}

        {/* EMAIL ADDRESS */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabelHeader}>EMAIL ADDRESS</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="you@example.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? (
            <Text style={styles.fieldError}>{errors.email}</Text>
          ) : null}
        </View>

        {/* PASSWORD with Forgot password? */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.inputLabelHeader}>PASSWORD</Text>
            <TouchableOpacity 
              onPress={() => Alert.alert('Forgot Password', 'Please enter your registered email address and contact admin to reset your password.')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
          />
          {errors.password ? (
            <Text style={styles.fieldError}>{errors.password}</Text>
          ) : null}
        </View>

        {/* SIGN IN BUTTON */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit} 
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.submitButtonText}>Sign In  →</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => onNavigate('Register')}>
            <Text style={styles.linkText}>Create account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => onNavigate('Home')}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  headerArea: {
    marginBottom: 20,
  },
  cloudBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 10,
  },
  cloudBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
  },
  authErrorText: {
    color: '#E11D48',
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabelHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  fieldError: {
    color: '#E11D48',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0EA5E9',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 18,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
