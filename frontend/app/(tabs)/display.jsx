import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// API configuration - update with your server IP or domain
const API_URL = 'http://192.168.43.64:5000/api';

const UserSearchScreen = () => {
  const [cpfNumber, setCpfNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCPFChange = (text) => {
    // Reset previous search results when searching for a new user
    if (userData) {
      setUserData(null);
    }
    if (errorMessage) {
      setErrorMessage('');
    }
    
    // Only allow up to 5 characters
    if (text.length <= 5) {
      setCpfNumber(text);
    }
  };

  const searchUser = async () => {
    // Validate CPF number
    if (!cpfNumber || cpfNumber.length !== 5) {
      setErrorMessage('Please enter a valid 5-character CPF number');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Fetch user data including images
      const response = await fetch(`${API_URL}/get-user-data/${cpfNumber}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve user data');
      }
      
      setUserData(data.user_data);
      
    } catch (error) {
      setErrorMessage(error.message);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>User Search</Text>
        
        {/* Search Form */}
        <View style={styles.searchContainer}>
          <Text style={styles.label}>CPF Number</Text>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              value={cpfNumber}
              onChangeText={handleCPFChange}
              placeholder="Enter 5-character CPF"
              maxLength={5}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchUser}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <FontAwesome name="search" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
        
        {/* User Data Display */}
        {userData && (
          <View style={styles.userDataContainer}>
            <Text style={styles.sectionTitle}>User Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CPF Number:</Text>
              <Text style={styles.infoValue}>{userData.cpf_number}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Submission Date:</Text>
              <Text style={styles.infoValue}>{userData.submission_date}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[
                styles.statusValue,
                userData.status === 'APPROVED' ? styles.statusApproved :
                userData.status === 'REJECTED' ? styles.statusRejected : 
                styles.statusPending
              ]}>
                {userData.status}
              </Text>
            </View>
            
            {/* Profile Image */}
            {userData.profile_image && (
              <View style={styles.imageSection}>
                <Text style={styles.imageSectionTitle}>Profile Photo</Text>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${userData.profile_image}` }}
                  style={styles.userImage}
                  resizeMode="cover"
                />
              </View>
            )}
            
            {/* Aadhar Image */}
            {userData.aadhar_image && (
              <View style={styles.imageSection}>
                <Text style={styles.imageSectionTitle}>Aadhar ID</Text>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${userData.aadhar_image}` }}
                  style={styles.userImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#ddd',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#3498db',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 17,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 8,
    fontSize: 14,
  },
  userDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    width: 120,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusApproved: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusRejected: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  imageSection: {
    marginTop: 20,
  },
  imageSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  userImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
});

export default UserSearchScreen;