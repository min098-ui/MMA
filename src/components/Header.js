import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function Header({ 
  user, 
  onLoginPress, 
  onRegisterPress, 
  onLogoutPress, 
  title = 'BookShelf' 
}) {
  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.appName}>{title}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {user ? (
          <View style={styles.userContainer}>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={onLogoutPress}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.authButtons}>
            {onLoginPress && (
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={onLoginPress}
                activeOpacity={0.7}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            )}
            {onRegisterPress && (
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={onRegisterPress}
                activeOpacity={0.7}
              >
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
    maxWidth: 150,
  },
  logoutButton: {
    backgroundColor: theme.colors.errorBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loginButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  loginText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  registerButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
  },
  registerText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
