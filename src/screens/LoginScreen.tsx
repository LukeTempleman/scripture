/**
 * Login screen component for Templeman Scripture application
 * Following zero-slop principles with complete error handling and UX
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  loading: boolean;
  error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({onLogin, loading, error}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  /**
   * Validate email format
   * Following Law 10 (Complete form validation)
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle login form submission
   * Following Laws 1, 2, 10, 22 (Complete form handling)
   */
  const handleLoginPress = async () => {
    try {
      // Clear previous errors
      setEmailError('');
      
      // Validate inputs
      if (!email.trim()) {
        setEmailError('Email is required');
        return;
      }
      
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      
      if (!password) {
        Alert.alert('Error', 'Password is required');
        return;
      }
      
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }

      // Submit login
      const result = await onLogin(email.trim(), password);
      
      if (!result.success && result.error) {
        Alert.alert('Login Failed', result.error);
      }
    } catch (err) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = err instanceof Error ? err.message : 'Login process failed';
      Alert.alert('Login Error', errorMessage);
    }
  };

  /**
   * Handle registration link press
   * Following Law 9 (No empty handlers)
   */
  const handleRegisterPress = () => {
    Alert.alert(
      'Registration',
      'Account creation is not implemented in this demo. In a full application, this would navigate to a registration screen.',
      [{text: 'OK'}]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Templeman</Text>
        <Text style={styles.subtitle}>Memorize Scripture Effectively</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        />
        {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          textContentType="password"
        />

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, loading ? styles.buttonDisabled : null]} 
          onPress={handleLoginPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    fontWeight: '600',
  },
});

export default LoginScreen;