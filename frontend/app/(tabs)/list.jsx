import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

const IdentificationDataScreen = () => {
  const [identificationData, setIdentificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchIdentificationData();
  }, []);

  const fetchIdentificationData = async () => {
    try {
      setLoading(true);
      // Replace with your server IP or domain if needed
      const response = await fetch('http://192.168.43.64:3000/identification-data');
      const result = await response.json();
      
      if (result.success) {
        setIdentificationData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch identification data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case 'APPROVED':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'REJECTED':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'PENDING':
      default:
        return { backgroundColor: '#fef9c3', color: '#854d0e' };
    }
  };

  const viewImage = (item, imageType) => {
    setSelectedItem({ ...item, imageType });
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    
    return (
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { marginTop: 10 },{ marginLeft: 10 } ]} >Your Certificate ID : XXXXXXXXXX </Text>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>CPF: {item.cpfNumber}</Text>
          
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Submitted on:</Text>
            <Text style={styles.date}>{formatDate(item.submissionDate)}</Text>
          </View>
          
          <View style={styles.imagesContainer}>
            <View style={styles.imageSection}>
              <Text style={styles.label}>Profile Image:</Text>
              <TouchableOpacity 
                onPress={() => viewImage(item, 'profile')}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: item.profileImageUrl }} 
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageSection}>
              <Text style={styles.label}>Aadhar Image:</Text>
              <TouchableOpacity 
                onPress={() => viewImage(item, 'aadhar')}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: item.aadharImageUrl }} 
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Handle errors during image loading
  const onImageError = () => {
    Alert.alert(
      "Image Error",
      "Could not load the image. It may be missing or inaccessible.",
      [{ text: "OK", onPress: () => setModalVisible(false) }]
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading identification data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error!</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchIdentificationData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Text style={styles.heading}>Identification Submissions</Text>
      
      {identificationData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No identification data found.</Text>
        </View>
      ) : (
        <FlatList
          data={identificationData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Image Viewer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedItem?.imageType === 'profile' ? 'Profile Image' : 'Aadhar ID Image'} 
                <Text style={styles.modalSubtitle}> (CPF: {selectedItem?.cpfNumber})</Text>
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalImageContainer}>
              {selectedItem && (
                <Image 
                  source={{ 
                    uri: selectedItem.imageType === 'profile' 
                      ? selectedItem.profileImageUrl 
                      : selectedItem.aadharImageUrl 
                  }} 
                  style={styles.fullImage}
                  resizeMode="contain"
                  onError={onImageError}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  listContainer: {
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  dateContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageSection: {
    width: '48%',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fee2e2',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontWeight: 'normal',
    color: '#888',
  },
  closeButton: {
    fontSize: 18,
    color: '#888',
    padding: 4,
  },
  modalImageContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#f0f0f0',
  },
});

export default IdentificationDataScreen;