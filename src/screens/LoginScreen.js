import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator 
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
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Enter your email and password to access BookShelf</Text>

        {authError ? (
          <View style={styles.errorBox}>
            <Text testID="error-auth" style={styles.authErrorText}>
              {authError}
            </Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? (
            <Text style={styles.fieldError}>{errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
          />
          {errors.password ? (
            <Text style={styles.fieldError}>{errors.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => onNavigate('Register')}>
            <Text style={styles.linkText}>Register here</Text>
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
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  errorBox: {
    backgroundColor: theme.colors.errorBg,
    borderColor: theme.colors.errorBorder,
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.lg,
  },
  authErrorText: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.colors.text,
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.errorBg,
  },
  fieldError: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  backButton: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  backButtonText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
