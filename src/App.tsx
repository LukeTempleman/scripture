import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
import {User, Verse} from './types';

// Services
import {YouVersionAPI} from './services/youversion';
import {AuthService} from './services/auth';
import {MemorizationService} from './services/memorization';

// Components
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import VerseSelector from './components/VerseSelector';
import MemorizationEngine from './components/MemorizationEngine';

/**
 * Main App component for Templeman Scripture application
 * Implements zero-slop principles with complete error handling and real functionality
 */
const App = () => {
  // State management following Laws 3, 24-27 (Complete state handling)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Services initialization
  const authService = new AuthService();
  const bibleService = new YouVersionAPI();
  const memorizationService = new MemorizationService();

  /**
   * Load user session on app startup
   * Following Law 3 (Complete state handling) and Law 2 (No silent failures)
   */
  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check for existing session
        const sessionToken = await AsyncStorage.getItem('auth_token');
        if (sessionToken) {
          // Validate session
          const userData = await authService.validateSession(sessionToken);
          if (userData) {
            setCurrentUser(userData);
            setIsAuthenticated(true);
            
            // Load user's verses
            const userVerses = await memorizationService.getUserVerses(userData.id);
            setVerses(userVerses);
          }
        }
      } catch (err) {
        // Following Law 1 (No empty catch blocks)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load session: ${errorMessage}`);
        console.error('Session loading error:', err);
        Alert.alert('Authentication Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /**
   * Handle user login with proper validation and error feedback
   * Following Laws 1, 2, 10, 22 (Complete error handling)
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Authenticate user
      const authResult = await authService.login(email, password);
      
      if (authResult.success && authResult.user && authResult.token) {
        // Store session
        await AsyncStorage.setItem('auth_token', authResult.token);
        setCurrentUser(authResult.user);
        setIsAuthenticated(true);
        
        // Load user's verses
        const userVerses = await memorizationService.getUserVerses(authResult.user.id);
        setVerses(userVerses);
        
        return {success: true};
      } else {
        throw new Error(authResult.message || 'Authentication failed');
      }
    } catch (err) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout with cleanup
   * Following Law 1 (Complete error handling)
   */
  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Clear local session
      await AsyncStorage.removeItem('auth_token');
      
      // Update state
      setCurrentUser(null);
      setIsAuthenticated(false);
      setVerses([]);
      setSelectedVerse(null);
      
      // Notify services
      authService.logout();
      
    } catch (err) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      Alert.alert('Logout Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load Bible content using YouVersion API
   * Following Laws 2, 5, 6 (Proper error handling for API calls)
   */
  const loadBibleContent = async (book: string, chapter: number, verse: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const content = await bibleService.getVerse(book, chapter, verse);
      if (!content || Object.keys(content).length === 0) {
        throw new Error('No content received from Bible API');
      }
      
      setSelectedVerse(content);
      return content;
    } catch (err) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Bible content';
      setError(errorMessage);
      Alert.alert('Bible Content Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a verse to user's memorization collection
   * Following Laws 3, 10 (Complete state and form handling)
   */
  const addToMemorization = async (verse: Verse) => {
    try {
      if (!currentUser) {
        throw new Error('User must be authenticated to add verses');
      }
      
      setLoading(true);
      setError(null);
      
      // Add verse to user's collection
      const result = await memorizationService.addVerse(currentUser.id, verse);
      
      if (result.success) {
        // Update local state
        setVerses(prev => [...prev, verse]);
        Alert.alert('Success', 'Verse added to your memorization list');
        return {success: true};
      } else {
        throw new Error(result.message || 'Failed to add verse');
      }
    } catch (err) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = err instanceof Error ? err.message : 'Failed to add verse';
      setError(errorMessage);
      Alert.alert('Add Verse Error', errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading && !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error && !isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text>Please restart the application</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LoginScreen 
          onLogin={handleLogin} 
          loading={loading} 
          error={error}
        />
      </SafeAreaView>
    );
  }

  // Render main app when authenticated
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      
      <HomeScreen 
        user={currentUser}
        verses={verses}
        selectedVerse={selectedVerse}
        onSelectVerse={loadBibleContent}
        onAddToMemorization={addToMemorization}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default App;