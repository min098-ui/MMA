import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  Platform 
} from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BookProvider } from './src/context/BookContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
import { theme } from './src/styles/theme';

function MainApp() {
  const { user, authLoading } = useAuth();
  const [loggedOutScreen, setLoggedOutScreen] = useState('Home');
  const [loggedInScreen, setLoggedInScreen] = useState('List');
  const [selectedBookId, setSelectedBookId] = useState(null);

  // While app is still checking whether someone is already logged in, show loading spinner with zero flash of content
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // When logged out
  if (!user) {
    if (loggedOutScreen === 'Login') {
      return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={theme.colors.card} />
          <LoginScreen onNavigate={(screen) => setLoggedOutScreen(screen)} />
        </SafeAreaView>
      );
    }

    if (loggedOutScreen === 'Register') {
      return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={theme.colors.card} />
          <RegisterScreen onNavigate={(screen) => setLoggedOutScreen(screen)} />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.card} />
        <HomeScreen onNavigate={(screen) => setLoggedOutScreen(screen)} />
      </SafeAreaView>
    );
  }

  // When logged in: app opens directly on List screen instead
  if (loggedInScreen === 'Detail' && selectedBookId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.card} />
        <DetailScreen 
          bookId={selectedBookId} 
          onBack={() => {
            setLoggedInScreen('List');
            setSelectedBookId(null);
          }} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.card} />
      <ListScreen 
        onNavigate={(screen) => setLoggedInScreen(screen)} 
        onSelectBook={(bookId) => {
          setSelectedBookId(bookId);
          setLoggedInScreen('Detail');
        }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <MainApp />
      </BookProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.card,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
