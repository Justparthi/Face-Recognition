import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';

const IdentificationForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick image from gallery
  const pickImage = async (setImageFunction) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageFunction(result.assets[0].uri);
      // Reset match result when new image is selected
      setMatchResult(null);
      setConfidenceLevel(null);
    }
  };

  // Function to take picture with camera
  const takePicture = async (setImageFunction) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageFunction(result.assets[0].uri);
      // Reset match result when new image is selected
      setMatchResult(null);
      setConfidenceLevel(null);
    }
  };

  // Function to show options for uploading (camera or gallery)
  const showImageOptions = (setImageFunction) => {
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        { 
          text: 'Take Photo', 
          onPress: () => takePicture(setImageFunction) 
        },
        { 
          text: 'Choose from Gallery', 
          onPress: () => pickImage(setImageFunction) 
        },
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
      ]
    );
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Check if image is uploaded
    if (!profileImage) {
      Alert.alert('Error', 'Please upload or take your photo');
      return;
    }
  
    try {
      setLoading(true);
      
      // Create form data
      const formData = new FormData();
      
      // Add profile image
      const profileImageName = profileImage.split('/').pop();
      const profileImageType = 'image/' + (profileImageName.split('.').pop() === 'png' ? 'png' : 'jpeg');
      formData.append('profileImage', {
        uri: Platform.OS === 'android' ? profileImage : profileImage.replace('file://', ''),
        name: profileImageName,
        type: profileImageType
      });
      
      // Send data to the server
      const response = await fetch('http://192.168.43.64:5000/submit-identification', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = await response.json();
      
      if (result.success) {
        // Store the match result and confidence level
        setMatchResult(result.data.match);
        setConfidenceLevel(result.data.confidence_level);
        
        // Optional: Show success message
        Alert.alert(
          'Success',
          'Face comparison completed successfully!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.message || 'Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert(
        'Error',
        'Failed to submit form. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Face Verification</Text>
        
        {/* Profile Image Upload */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Your Photo</Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => showImageOptions(setProfileImage)}
          >
            <FontAwesome name="camera" size={22} color="#fff" />
            <Text style={styles.uploadButtonText}>
              {profileImage ? 'Change Photo' : 'Take/Upload Photo'}
            </Text>
          </TouchableOpacity>
          
          {profileImage && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: profileImage }} style={styles.preview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => {
                  setProfileImage(null);
                  setMatchResult(null);
                  setConfidenceLevel(null);
                }}
              >
                <FontAwesome name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Match Result Display */}
        {matchResult !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Verification Result:</Text>
            <View style={[
              styles.matchResult, 
              { backgroundColor: matchResult ? '#28a745' : '#dc3545' }
            ]}>
              <Text style={styles.matchResultText}>
                {matchResult ? 'NO MATCH' : 'MATCH'}
              </Text>
            </View>
            {confidenceLevel && (
              <Text style={styles.confidenceText}>
                Confidence: <Text style={styles.confidenceLevel}>{confidenceLevel}</Text>
              </Text>
            )}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            loading && styles.disabledButton,
            !profileImage && styles.disabledButton
          ]}
          disabled={loading || !profileImage}
          onPress={handleSubmit}
        >
          {loading ? (
            <Text style={styles.submitButtonText}>Processing...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Verify Face</Text>
          )}
        </TouchableOpacity>
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
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  previewContainer: {
    marginTop: 15,
    position: 'relative',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    marginVertical: 20,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  matchResult: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  matchResultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
  },
  confidenceLevel: {
    fontWeight: 'bold',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default IdentificationForm;