import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from "../App";

// Use '10.0.2.2' for Android emulator, '192.168.1.107' for physical device
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/auth' : 'http://192.168.1.107:5000/api/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [signInNumber, setSignInNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const isValidPhoneNumber = useCallback((phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  }, []);

  const handleBackendVerification = useCallback(
    async (phone: string, isNewUser = false) => {
      try {
        setLoading(true);
        console.log(`Sending request to ${API_BASE_URL}${isNewUser ? '/register' : '/verify-phone'} with phone: ${phone}`);
        const endpoint = isNewUser ? '/register' : '/verify-phone';
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
          phoneNumber: phone,
          name: isNewUser ? name : undefined,
        }, {
          timeout: 5000, // Add timeout to prevent hanging
        });

        console.log('Backend Response:', response.data);

        if (response.data.success && response.data.token) {
          await AsyncStorage.setItem('authToken', response.data.token);
          await AsyncStorage.setItem('isRegistered', 'true');
          console.log('Navigating to Screen1');
          navigation.navigate('Screen1');
        } else if (response.data.error?.includes('already registered')) {
          Alert.alert('Already Registered', 'This mobile number is already registered. Please sign in instead.');
          setActiveTab('signin');
          setSignInNumber(phone);
        } else {
          throw new Error(response.data.error || 'Backend verification failed');
        }
      } catch (error: any) {
        console.error('Backend Verification Error:', error.message, error.response?.data);
        const errorMessage = error.response?.data?.error || error.message || 'Failed to connect to the server. Please check your network and try again.';
        Alert.alert('Error', errorMessage);
        if (errorMessage.includes('already registered')) {
          setActiveTab('signin');
          setSignInNumber(phone);
        }
      } finally {
        setLoading(false);
      }
    },
    [name, navigation]
  );

  const signInWithPhoneNumber = useCallback(async () => {
    if (!signInNumber) {
      Alert.alert('Error', 'Please enter your mobile number.');
      return;
    }
    if (!isValidPhoneNumber(signInNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    try {
      setLoading(true);
      console.log(`Sending OTP to +91${signInNumber}`);
      const confirmation = await auth().signInWithPhoneNumber(`+91${signInNumber}`);
      setConfirm(confirmation);
      Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
    } catch (error: any) {
      console.error('SignIn Error:', error.code, error.message);
      Alert.alert(
        'Error',
        error.code === 'auth/invalid-phone-number'
          ? 'The mobile number is invalid. Please check and try again.'
          : error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [signInNumber, isValidPhoneNumber]);

  const confirmCode = useCallback(async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    if (!confirm) {
      Alert.alert('Error', 'No OTP confirmation available. Please request a new OTP.');
      return;
    }
    try {
      setLoading(true);
      console.log('Verifying OTP:', code);
      const userCredential = await confirm.confirm(code);
      if (userCredential?.user) {
        console.log('OTP Verified, User:', userCredential.user.uid);
        const isNewUser = activeTab === 'signup';
        await handleBackendVerification(isNewUser ? mobileNumber : signInNumber, isNewUser);
      } else {
        throw new Error('Failed to verify OTP: No user credential returned');
      }
    } catch (error: any) {
      console.error('OTP Verification Error:', error.code, error.message);
      Alert.alert(
        'Error',
        error.code === 'auth/invalid-verification-code'
          ? 'The OTP you entered is incorrect. Please try again.'
          : error.message || 'Failed to verify OTP.'
      );
    } finally {
      setLoading(false);
    }
  }, [code, confirm, activeTab, mobileNumber, signInNumber, handleBackendVerification]);

  const handleSignUp = useCallback(async () => {
    if (!name || !mobileNumber) {
      Alert.alert('Error', 'Please enter both name and mobile number.');
      return;
    }
    if (!isValidPhoneNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    try {
      setLoading(true);
      console.log(`Checking phone number: ${mobileNumber}`);
      const { data } = await axios.post(`${API_BASE_URL}/verify-phone`, { phoneNumber: mobileNumber }, {
        timeout: 5000,
      });
      if (data.success && !data.newUser) {
        Alert.alert('Already Registered', 'This mobile number is already registered. Please sign in instead.');
        setActiveTab('signin');
        setSignInNumber(mobileNumber);
        return;
      }
      console.log(`Sending OTP to +91${mobileNumber}`);
      const confirmation = await auth().signInWithPhoneNumber(`+91${mobileNumber}`);
      setConfirm(confirmation);
      Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
    } catch (error: any) {
      console.error('SignUp Error:', error.message, error.response?.data);
      if (error.response?.data?.error?.includes('already registered')) {
        Alert.alert('Already Registered', 'This mobile number is already registered. Please sign in instead.');
        setActiveTab('signin');
        setSignInNumber(mobileNumber);
      } else {
        Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [name, mobileNumber, isValidPhoneNumber]);

  const switchTab = useCallback((tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setConfirm(null);
    setCode('');
    setName('');
    setMobileNumber('');
    setSignInNumber('');
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <View style={styles.header}>
        <Image
          source={require('../assets/11111.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.card}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => switchTab('signin')}
            style={[styles.tab, activeTab === 'signin' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'signin' && styles.activeTabText]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => switchTab('signup')}
            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'signin' ? (
          <>
            <Text style={styles.loginText}>Login with your phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 Mobile Number"
              value={signInNumber}
              onChangeText={text => setSignInNumber(text.replace(/[^0-9]/g, ''))}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {confirm ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={confirmCode}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={signInWithPhoneNumber}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="+91 Mobile Number"
              value={mobileNumber}
              onChangeText={text => setMobileNumber(text.replace(/[^0-9]/g, ''))}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {confirm ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={confirmCode}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00cc00',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '60%',
    height: '60%',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    marginTop: -150,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tab: {
    marginHorizontal: 20,
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00cc00',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#00cc00',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  loginText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00cc00',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;