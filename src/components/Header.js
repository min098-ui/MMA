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
        <Text style={styles.brandIcon}>☁️ </Text>
        <Text style={styles.appName}>{title}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {user ? (
          <View style={styles.userContainer}>
            <View style={styles.userBadge}>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0EA5E9',
    letterSpacing: -0.4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    marginRight: 8,
    maxWidth: 145,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  logoutButton: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  logoutText: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '800',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  loginText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  registerButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
