import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { theme } from '../styles/theme';

export default function HomeScreen({ onNavigate }) {
  const features = [
    {
      title: 'Track your books',
      description: 'Keep your personal library organized with titles, authors, genres, and notes.',
      icon: '📚',
    },
    {
      title: 'Sort by status',
      description: 'Easily filter and organize books by To Read, Reading, and Finished states.',
      icon: '📊',
    },
    {
      title: 'Rate your favorites',
      description: 'Highlight your top books with a star toggle and rate them from 0 to 5.',
      icon: '⭐',
    },
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="BookShelf"
        onLoginPress={() => onNavigate('Login')}
        onRegisterPress={() => onNavigate('Register')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text testID="home-title" style={styles.heroTitle}>
            BookShelf
          </Text>
          <Text style={styles.heroSubtitle}>
            Your personal digital bookshelf. Track what you own, record what you want to read, and organize your favorite books all in one clean place.
          </Text>

          <View style={styles.heroActionButtons}>
            <TouchableOpacity 
              style={styles.primaryActionButton}
              onPress={() => onNavigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryActionText}>Get Started / Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={() => onNavigate('Register')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryActionText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardIcon}>{feature.icon}</Text>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  heroActionButtons: {
    width: '100%',
    gap: theme.spacing.md,
  },
  primaryActionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  primaryActionText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryActionText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  featuresSection: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: theme.spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
