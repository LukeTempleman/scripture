/**
 * Home screen component for Templeman Scripture application
 * Following zero-slop principles with complete functionality
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {User, Verse} from '../types';
import VerseSelector from '../components/VerseSelector';
import MemorizationList from '../components/MemorizationList';

interface HomeScreenProps {
  user: User | null;
  verses: Verse[];
  selectedVerse: Verse | null;
  onSelectVerse: (book: string, chapter: number, verse: number) => Promise<Verse>;
  onAddToMemorization: (verse: Verse) => Promise<{success: boolean; error?: string}>;
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  verses,
  selectedVerse,
  onSelectVerse,
  onAddToMemorization,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'memorize'>('browse');
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Handle logout confirmation
   * Following Law 9 (No empty handlers)
   */
  const handleLogoutPress = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: onLogout},
      ]
    );
  };

  /**
   * Handle verse selection
   * Following Laws 3, 22 (Complete state handling)
   */
  const handleSelectVerse = async (book: string, chapter: number, verse: number) => {
    try {
      if (!book || chapter <= 0 || verse <= 0) {
        Alert.alert('Invalid Selection', 'Please select a valid Bible reference');
        return;
      }
      
      await onSelectVerse(book, chapter, verse);
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load verse';
      Alert.alert('Error', errorMessage);
    }
  };

  /**
   * Handle adding verse to memorization list
   * Following Laws 3, 10 (Complete form handling)
   */
  const handleAddToMemorization = async (verse: Verse) => {
    try {
      if (!verse) {
        Alert.alert('Error', 'No verse selected');
        return;
      }
      
      const result = await onAddToMemorization(verse);
      
      if (!result.success && result.error) {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add verse';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' ? styles.activeTab : null]}
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' ? styles.activeTabText : null]}>
            Browse
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'memorize' ? styles.activeTab : null]}
          onPress={() => setActiveTab('memorize')}
        >
          <Text style={[styles.tabText, activeTab === 'memorize' ? styles.activeTabText : null]}>
            Memorize ({verses.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content}>
        {activeTab === 'browse' ? (
          <View>
            <VerseSelector 
              onSelectVerse={handleSelectVerse}
              onAddToMemorization={handleAddToMemorization}
              selectedVerse={selectedVerse}
            />
          </View>
        ) : (
          <MemorizationList 
            verses={verses}
            onSelectVerse={handleSelectVerse}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6c757d',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default HomeScreen;