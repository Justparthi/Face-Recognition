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
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';


const IdentificationForm = () => {
  const [cpfNumber, setCpfNumber] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);

  const handleCPFChange = (text) => {
    if (text.length <= 5) {
      setCpfNumber(text);
    }
  };

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
    // Validate CPF number (must be exactly 5 characters)
    if (cpfNumber.length !== 5) {
      Alert.alert('Error', 'Please enter exactly 5 characters for CPF number');
      return;
    }
  
    // Check if images are uploaded
    if (!profileImage) {
      Alert.alert('Error', 'Please upload or take your photo');
      return;
    }
  
    if (!aadharImage) {
      Alert.alert('Error', 'Please upload your Aadhar ID');
      return;
    }
  
    try {
      // Create form data
      const formData = new FormData();
      formData.append('cpfNumber', cpfNumber);
      
      // Add profile image
      const profileImageName = profileImage.split('/').pop();
      const profileImageType = 'image/' + (profileImageName.split('.').pop() === 'png' ? 'png' : 'jpeg');
      formData.append('profileImage', {
        uri: Platform.OS === 'android' ? profileImage : profileImage.replace('file://', ''),
        name: profileImageName,
        type: profileImageType
      });
      
      // Add Aadhar image
      const aadharImageName = aadharImage.split('/').pop();
      const aadharImageType = 'image/' + (aadharImageName.split('.').pop() === 'png' ? 'png' : 'jpeg');
      formData.append('aadharImage', {
        uri: Platform.OS === 'android' ? aadharImage : aadharImage.replace('file://', ''),
        name: aadharImageName,
        type: aadharImageType
      });
  
      // Display loading indicator or disable submit button here
      
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
        Alert.alert(
          'Success',
          'Identification data submitted successfully!',
          [{ text: 'OK' }]
        );
        
        // Reset form after successful submission
        setCpfNumber('');
        setProfileImage(null);
        setAadharImage(null);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert(
        'Error',
        'Failed to submit form. Please check your connection and try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Identification Form</Text>
        
        {/* CPF Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF Number</Text>
          <TextInput
            style={styles.input}
            value={cpfNumber}
            onChangeText={handleCPFChange}
            placeholder="Enter 5 characters"
            maxLength={5}
          />
          <Text style={styles.helperText}>
            Enter exactly 5 characters (letters or numbers)
          </Text>
        </View>

        {/* Profile Image Upload */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Profile Photo</Text>
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
                onPress={() => setProfileImage(null)}
              >
                <FontAwesome name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Aadhar ID Upload */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Aadhar ID</Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => showImageOptions(setAadharImage)}
          >
            <FontAwesome name="id-card" size={22} color="#fff" />
            <Text style={styles.uploadButtonText}>
              {aadharImage ? 'Change Aadhar ID' : 'Upload Aadhar ID'}
            </Text>
          </TouchableOpacity>
          
          {aadharImage && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: aadharImage }} style={styles.preview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => setAadharImage(null)}
              >
                <FontAwesome name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  imageContainer: {
    marginBottom: 20,
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
  submitButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default IdentificationForm;