import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const RegisterScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  const router = useRouter();

  const handleSendOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.5:3000/send-otp', {
        mobile_number: mobileNumber,
      });

      if (response.data && response.data.success) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent successfully to your mobile number');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setVerifying(true);

    try {
      const response = await axios.post('http://192.168.43.64:3000/verify-otp', {
        mobile_number: mobileNumber,
        otp: enteredOtp
      });

      if (response.data && response.data.success) {
        Alert.alert('Success', 'OTP verified successfully');
        router.push('/explore');
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {!otpSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />

          <Button
            title={loading ? 'Sending OTP...' : 'Send OTP'}
            onPress={handleSendOtp}
            disabled={loading}
            color="#4A90E2" // Light blue for buttons
          />
        </>
      ) : (
        <>
          <Text style={styles.infoText}>
            An OTP has been sent to {mobileNumber}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            keyboardType="number-pad"
            maxLength={6}
            value={enteredOtp}
            onChangeText={setEnteredOtp}
          />

          <Button
            title={verifying ? 'Verifying...' : 'Verify OTP'}
            onPress={handleVerifyOtp}
            disabled={verifying}
            color="#4A90E2" // Light blue for buttons
          />
          
          <Button
            title="Resend OTP"
            onPress={handleSendOtp}
            disabled={loading}
            color="#888" // Light grey for disabled button
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF', // White background for light theme
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333', // Dark text color for readability
  },
  input: {
    height: 40,
    borderColor: '#ddd', // Light grey border for input fields
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Light background for input fields
  },
  infoText: {
    marginBottom: 20,
    fontSize: 16,
    color: '#333333', // Dark text for info message
    textAlign: 'center',
  },
});

export default RegisterScreen;
