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
        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={styles.cloudBadge}>
            <Text style={styles.cloudBadgeText}>☁️  LÀNG MÂY BOOKSHELF</Text>
          </View>

          <Text testID="home-title" style={styles.heroTitle}>
            BookShelf
          </Text>

          <Text style={styles.heroSubtitle}>
            Your personal digital bookshelf in a calm, modern cloud aesthetic. Organize, track, and enjoy your reading journey with ease.
          </Text>

          <View style={styles.heroActionButtons}>
            <TouchableOpacity 
              style={styles.primaryActionButton}
              onPress={() => onNavigate('Login')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionText}>Sign In  →</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={() => onNavigate('Register')}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryActionText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>KEY FEATURES</Text>
            <View style={styles.headingLine} />
          </View>

          {features.map((feature, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.iconCircle}>
                <Text style={styles.cardIcon}>{feature.icon}</Text>
              </View>
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
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    marginVertical: 12,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  cloudBadge: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    marginBottom: 14,
  },
  cloudBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0EA5E9',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  heroActionButtons: {
    width: '100%',
    gap: 12,
  },
  primaryActionButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryActionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryActionText: {
    color: '#0EA5E9',
    fontSize: 15,
    fontWeight: '800',
  },
  featuresSection: {
    marginTop: 12,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  headingLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    fontWeight: '500',
  },
});
